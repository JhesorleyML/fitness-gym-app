const express = require("express");
const router = express.Router();

const {
  Subscription,
  ClientInfo,
  ClientSubscription,
  Payment,
} = require("../models");

//get subscription  by client
router.get("/:clientId", async (req, res, next) => {
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
    next(error);
  }
});

//get all clients with active sessions
router.get("/active/all", async (req, res, next) => {
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
    next(error);
  }
});

//get list client per subscription
router.get("/subs/:subId", async (req, res, next) => {
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
    next(error);
  }
});

//create new clientssubs record
router.post("/new", async (req, res, next) => {
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
    //create a new date object based on datestart
    const startDate = new Date(datestart);
    //dateEnd in the database = dateStart + (duration-1) payment is for the first day of the subscription so we add (duration-1) to get the end date
    startDate.setDate(startDate.getDate() + (parseInt(duration) - 1));
    const dateend =
      parseInt(duration) === 0 ? null : startDate.toISOString().split("T")[0];
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
          },
        );
        console.log(upd);
      }
    }
    //return success message
    res.status(201).send({ message: "Payment successful." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
