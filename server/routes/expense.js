const express = require("express");
const router = express.Router();

const { Expense, User } = require("../models");

//find all
router.get("/", async (req, res) => {
  try {
    const expenseList = await Expense.findAll({
      attributes: [
        "title",
        "expdate",
        "description",
        "amount",
        "category",
        "image",
      ],
      include: { model: User, attributes: ["fullname"] },
      order: [["expdate", "DESC"]],
    });
    //get the image attached
    const host = req.get("host");
    const protocol = req.protocol;
    const updatedExpensList = expenseList.map((expense) => {
      if (expense.image) {
        expense.image = `${protocol}://${host}/uploads/${expense.image}`;
      }
      return expense;
    });
    res.status(200).json(updatedExpensList);
  } catch (error) {
    res.status(500).send({
      message: "An error occured while fetching expense data from the database",
    });
  }
});

//find all by id
router.get("/:userId", async (req, res) => {
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
    res.status(500).send({
      message: "An error occured while fetching expense data from the database",
    });
  }
});

//add new expense
router.post("/new", (req, res) => {
  console.log(req);
  const upload = req.upload.single("pic");
  console.log("upload:", upload);
  upload(req, res, async (err) => {
    const expenseData = {
      ...req.body,
      pic: req.file ? req.file.path : "default.jpg",
    };
    console.log("req.file", req.file);
    console.log(expenseData);
    if (err) {
      console.log("Multer Error:".err);
      return res.status(400).json({ message: "Failed to upload image" });
    }
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
      res.status(500).send({
        message:
          "An error occured while adding new expense data to the database",
        error,
      });
    }
  });
});

module.exports = router;
