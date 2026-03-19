const express = require("express");
const router = express.Router();
const { format } = require("date-fns");
const { Op } = require("sequelize");

const {
  ClientInfo,
  ClientSubscription,
  EmergencyContact,
} = require("../models");

//get the list of clients
router.get("/", async (req, res) => {
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
    res.status(500).send({
      message:
        "An error occured while retrieving client data from the database",
      error,
    });
  }
});

//create new client
router.post("/new", (req, res) => {
  console.log(req);
  const upload = req.upload.single("pic");
  console.log(upload);
  upload(req, res, async (err) => {
    const clientData = {
      ...req.body,
      pic: req.file ? req.file.path : `default.jpg`, // Use uploaded file or default
    };
    console.log(clientData);
    // console.log(req.file);
    if (err) {
      console.log("Multer error:".err);
      return res.status(400).json({ message: "Failed to upload image" });
    }
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
      res.status(500).send({
        message: "An error occured while adding client data to the database ",
        error,
      });
    }
  });
});

//update client info
router.put("/update/:id", async (req, res) => {
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
      pic,
      ename,
      econtact,
    } = req.body;
    //update clieninfo
    const client = await ClientInfo.update(
      {
        firstname: fname,
        lastname: lname,
        middlename: mname,
        address: address,
        bdate: bdate,
        contactno: contact,
        sex: sex,
        pic: pic,
      },
      { where: { id: id } }
    );
    //update client emercontact
    const emergencyContact = await EmergencyContact.update(
      {
        name: ename,
        contact: econtact,
      },
      { where: { ClientInfoId: id } }
    );
    res
      .status(201)
      .send({ message: `Successfully updated ${emergencyContact}` });
  } catch (error) {
    res.status(500).send({
      message: "An error occured while updating client data from the database",
      error,
    });
  }
});

module.exports = router;
