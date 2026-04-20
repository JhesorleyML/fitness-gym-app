const express = require("express");
const router = express.Router();
const { format } = require("date-fns");
const { Op } = require("sequelize");

const {
  ClientInfo,
  ClientSubscription,
  EmergencyContact,
} = require("../models");
const { generateUniqueQRCode } = require("../utils/qrGenerator");

//get the list of clients
router.get("/", async (req, res, next) => {
  try {
    const clientList = await ClientInfo.findAll({
      attributes: [
        "id",
        "firstname",
        "lastname",
        "middlename",
        "address",
        "bdate",
        "contactno",
        "sex",
        "pic",
        "isMember",
        "qrCode",
      ],
      include: { model: EmergencyContact, attributes: ["name", "contact"] },
      order: [["lastname", "ASC"], ["firstname"]],
    });
    //create a variable to get the current date
    const currentDate = new Date();
    const today = format(currentDate, "yyyy-MM-dd");
    console.log(today);
    //perform a query to clientSubscription
    const clientSubs = await ClientSubscription.findAll({
      attributes: ["ClientInfoId", "dateend"],
      where: { dateend: { [Op.gte]: today } },
    });
    const activeClientSubs = new Map();

    clientSubs.forEach((item) => {
      activeClientSubs.set(item.ClientInfoId, item.dateend);
    });

    const clientData = clientList.map((client) => {
      const clientObj = client.toJSON();

      const dateend = activeClientSubs.get(clientObj.id);
      const isActive = dateend !== undefined;

      return {
        ...clientObj,
        isActive,
        dateend: isActive ? dateend : null, // only include dateend if active
      };
    });

    console.log("ClientData", clientData);

    // //let activeClientsID = [];
    // const clientData = clientList.map((client) => {
    //   const clientData = client.toJSON();
    //   const isActive = clientSubs.some(
    //     (item) => item.ClientInfoId === clientData.id
    //   );
    //   //const isActiveItem = isActive;

    //   const data = { ...clientData, isActive, };
    //   return data;
    // });
    // console.log(clientData);

    //console.log(activeClientsID);
    //Dynamically construct the full images URL
    const host = req.get("host");
    const protocol = req.protocol;
    const updatedClientList = clientData.map((client) => {
      //const clientData = client.toJSON(); //convert sequelize instance to plain jsonObject
      if (client.pic)
        client.pic = `${protocol}://${host}/uploads/${client.pic}`;
      return client;
    });
    console.log(updatedClientList);
    res.status(200).json(updatedClientList);
  } catch (error) {
    next(error);
  }
});

//create new client
router.post("/new", (req, res, next) => {
  console.log(req);
  const upload = req.upload.single("pic");
  console.log(upload);
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    const clientData = {
      ...req.body,
      pic: req.file ? req.file.path : `default.jpg`, // Use uploaded file or default
    };
    console.log(clientData);
    // console.log(req.file);
    try {
      const {
        firstname,
        lastname,
        middlename,
        address,
        bdate,
        contact,
        sex,
        emergencyName,
        emergencyContact,
      } = clientData;
      const photo = req.file ? req.file.filename : "default.jpg";
      console.log(photo);
      
      // Generate unique 10-digit QR code
      const qrCode = await generateUniqueQRCode();

      //save client info
      const client = await ClientInfo.create({
        firstname: firstname,
        lastname: lastname,
        middlename: middlename,
        address: address,
        bdate: bdate,
        contactno: contact,
        sex: sex,
        pic: photo,
        isMember: false,
        qrCode: qrCode,
      });
      console.log(client);
      //save the emergency contact
      await EmergencyContact.create({
        name: emergencyName,
        contact: emergencyContact,
        ClientInfoId: client.id,
      });

      res.status(201).send({
        message: "New client information successfully created",
      });
    } catch (error) {
      next(error);
    }
  });
});

//update client info
router.put("/update/:id", (req, res, next) => {
  const upload = req.upload.single("pic");
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    try {
      const { id } = req.params;
      const {
        fname,
        lname,
        mname,
        address,
        bdate,
        contact,
        sex,
        ename,
        econtact,
      } = req.body;

      // If a new file was uploaded, use its filename; otherwise, keep the old one (if passed)
      const photo = req.file ? req.file.filename : req.body.pic;

      //update clieninfo
      await ClientInfo.update(
        {
          firstname: fname,
          lastname: lname,
          middlename: mname,
          address: address,
          bdate: bdate,
          contactno: contact,
          sex: sex,
          pic: photo,
        },
        { where: { id: id } }
      );
      //update client emercontact
      await EmergencyContact.update(
        {
          name: ename,
          contact: econtact,
        },
        { where: { ClientInfoId: id } }
      );
      res.status(201).send({ message: `Successfully updated client information` });
    } catch (error) {
      next(error);
    }
  });
});

module.exports = router;
