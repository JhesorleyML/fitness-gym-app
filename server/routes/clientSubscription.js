const express = require("express");
const router = express.Router();

const {
  Subscription,
  ClientInfo,
  ClientSubscription,
  Payment,
} = require("../models");

//get subscription  by client
router.get("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const listOfClientSubscriptions = await ClientSubscription.findAll({
      attributes: ["datestart", "dateend"],
      include: [
        {
          model: ClientInfo,
          attributes: ["id", "firstname", "middlename", "lastname"],
        },
        { model: Subscription, attributes: ["id", "category"] },
      ],
      where: { ClientInfoId: clientId },
    });
    res.status(200).json(listOfClientSubscriptions);
  } catch (error) {
    res.status(500).send({
      message: "An occured while retrieving client subscription records",
      error,
    });
  }
});

//get all clients with active sessions
router.get("/active/all", async (req, res) => {
  try {
    const clientList = await ClientSubscription.findAll({
      attributes: ["datestart", "dateend"],
      include: {
        model: ClientInfo,
        attributes: [
          "id",
          "firstname",
          "middlename",
          "lastname",
          "sex",
          "isMember",
        ],
      },
    });
    res.status(200).json(clientList);
  } catch (error) {
    res.status(500).send({
      message: "An occured while retrieving client subscription records",
      error,
    });
  }
});

//get list client per subscription
router.get("/subs/:subId", async (req, res) => {
  try {
    const { subId } = req.params;
    const clientList = await ClientSubscription.findAll({
      attributes: ["datestart", "dateend"],
      include: {
        model: ClientInfo,
        attributes: ["id", "firstname", "middlename", "lastname", "sex"],
      },
      where: { SubscriptionId: subId },
    });
    res.status(200).json(clientList);
  } catch (error) {
    res.status(500).send({
      message: "An occured while retrieving client subscription records",
      error,
    });
  }
});

//create new clientssubs record
router.post("/new", async (req, res) => {
  try {
    const {
      clientId,
      datestart,
      subsId,
      amount,
      duration,
      userId,
      paymentdate,
    } = req.body;
    //create a new date object
    const currentDate = new Date();
    //dateEnd in the database = dateStart + duration
    currentDate.setDate(currentDate.getDate() + parseInt(duration));
    const dateend =
      parseInt(duration) === 0 ? null : currentDate.toISOString().split("T")[0];
    //create new record
    console.log(dateend);
    const newClientSub = await ClientSubscription.create({
      datestart: datestart,
      dateend: dateend,
      ClientInfoId: clientId,
      SubscriptionId: subsId,
    });
    if (newClientSub) {
      //create new Payment
      console.log(newClientSub.id, "PaymentDate: ", paymentdate);
      const payment = await Payment.create({
        amount: amount,
        UserId: userId,
        ClientSubscriptionId: newClientSub.id,
        paymentdate: paymentdate,
      });
      //update the client info is member if payment is for membership //membership is lifetime meaning duration is 0
      if (parseInt(duration) === 0) {
        const upd = await ClientInfo.update(
          { isMember: true },
          {
            where: { id: clientId },
          }
        );
        console.log(upd);
      }
    }
    //return success message
    res.status(201).send({ message: "Payment successful." });
  } catch (error) {
    res.status(500).send({
      message: "An error occured while adding new client subscription record",
      error,
    });
  }
});

module.exports = router;
