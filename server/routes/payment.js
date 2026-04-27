const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const {
  Payment,
  Subscription,
  ClientSubscription,
  ClientInfo,
} = require("../models");
const sequelize = require("sequelize");

// Get daily payment totals for the dashboard chart
router.get("/summary", async (req, res, next) => {
  try {
    const dailyTotals = await Payment.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("paymentdate")), "date"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("paymentdate"))],
      order: [[sequelize.fn("DATE", sequelize.col("paymentdate")), "ASC"]],
    });
    res.status(200).json(dailyTotals);
  } catch (error) {
    next(error);
  }
});

//get all payments with pagination and search
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      attributes: ["id", "amount", "paymentdate"],
      include: {
        model: ClientSubscription,
        attributes: ["ClientInfoId", "SubscriptionId", "datestart", "dateend"],
        required: true,
        include: [
          {
            model: ClientInfo,
            attributes: [
              "firstname",
              [sequelize.literal("SUBSTRING(middlename, 1, 1)"), "middlename"],
              "lastname",
            ],
            where: search
              ? {
                  [Op.or]: [
                    { firstname: { [Op.like]: `%${search}%` } },
                    { lastname: { [Op.like]: `%${search}%` } },
                    { middlename: { [Op.like]: `%${search}%` } },
                  ],
                }
              : null,
          },
          { model: Subscription, attributes: ["category"] },
        ],
      },
      order: [["paymentdate", "DESC"]],
      limit: limit,
      offset: offset,
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      payments: rows,
    });
  } catch (error) {
    next(error);
  }
});

//get the payments made by the account
router.get("/:clientId", async (req, res, next) => {
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
    next(error);
  }
});

module.exports = router;
