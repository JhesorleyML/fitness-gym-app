const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const { Expense, User } = require("../models");

// Get daily expense totals for the dashboard chart
router.get("/summary", async (req, res, next) => {
  try {
    const dailyTotals = await Expense.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("expdate")), "date"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("expdate"))],
      order: [[sequelize.fn("DATE", sequelize.col("expdate")), "ASC"]],
    });
    res.status(200).json(dailyTotals);
  } catch (error) {
    next(error);
  }
});

//find all with pagination and search
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const { count, rows } = await Expense.findAndCountAll({
      attributes: [
        "id",
        "title",
        "expdate",
        "description",
        "amount",
        "category",
        "image",
      ],
      where: search ? {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { category: { [Op.like]: `%${search}%` } },
        ]
      } : null,
      include: { model: User, attributes: ["fullname"] },
      order: [["expdate", "DESC"]],
      limit: limit,
      offset: offset,
    });

    //get the image attached
    const host = req.get("host");
    const protocol = req.protocol;
    const updatedExpenses = rows.map((expense) => {
      const expenseObj = expense.toJSON();
      if (expenseObj.image) {
        expenseObj.image = `${protocol}://${host}/uploads/${expenseObj.image}`;
      }
      return expenseObj;
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      expenses: updatedExpenses,
    });
  } catch (error) {
    next(error);
  }
});

//find all by id
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const expenseList = await Expense.findAll({
      attributes: [
        "title",
        "expdate",
        "amount",
        "category",
        "description",
        "image",
      ],
      include: { model: User, attributes: ["fullname"] },
      where: { UserId: userId },
      order: [["expdate", "DESC"]],
    });
    res.status(200).json(expenseList);
  } catch (error) {
    next(error);
  }
});

//add new expense
router.post("/new", (req, res, next) => {
  console.log(req);
  const upload = req.upload.single("pic");
  console.log("upload:", upload);
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    const expenseData = {
      ...req.body,
      pic: req.file ? req.file.path : "default.jpg",
    };
    console.log("req.file", req.file);
    console.log(expenseData);
    //insert to database
    try {
      const { title, expdate, amount, category, description } = expenseData;
      const img = req.file ? req.file.filename : "default.jpg";
      const expense = await Expense.create({
        title: title,
        category: category,
        expdate: expdate,
        amount: amount,
        description: description,
        image: img,
      });
      res.status(201).send({ message: "New expense successfully added" });
    } catch (error) {
      next(error);
    }
  });
});

module.exports = router;
