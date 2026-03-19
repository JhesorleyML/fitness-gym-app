const express = require("express");
const router = express.Router();

const {
  Payment,
  Subscription,
  ClientSubscription,
  ClientInfo,
} = require("../models");

//get all payments
router.get("/", async (req, res) => {
  try {
    const paymentList = await Payment.findAll({
      attributes: ["amount", "paymentdate"],
      include: {
        model: ClientSubscription,
        attributes: ["ClientInfoId", "SubscriptionId", "datestart", "dateend"],
        include: [
          {
            model: ClientInfo,
            attributes: ["firstname", "middlename", "lastname"],
          },
          { model: Subscription, attributes: ["category"] },
        ],
      },
      order: [["paymentdate", "DESC"]],
    });
    res.status(200).json(paymentList);
  } catch (error) {
    res.status(500).send({
      message:
        "An error occured while retrieving payment transactions from the database",
      error,
    });
  }
});

//get the payments made by the account
router.get("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const paymentList = await ClientSubscription.findAll({
      attributes: ["id", "ClientInfoId"],
      include: {
        model: Payment,
        attributes: ["paymentdate", "amount"],
        order: [["paymentdate", "DESC"]],
      },
      where: { ClientInfoId: clientId },
    });
    res.status(200).json(paymentList);
  } catch (error) {
    res.status(500).send({
      message:
        "An error occured while retrieving payment transactions of this account from the database",
      error,
    });
  }
});

module.exports = router;
