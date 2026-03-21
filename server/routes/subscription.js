const express = require("express");
const router = express.Router();

const { Subscription } = require("../models");

//create new subscription
router.post("/new", async (req, res, next) => {
  try {
    const newSubcription = req.body;
    await Subscription.create(newSubcription);
    res.status(201).send({
      message: "Successfully saved",
    });
  } catch (error) {
    next(error);
  }
});

//get the list of subscriptions
router.get("/", async (req, res, next) => {
  try {
    const listOfSubs = await Subscription.findAll({
      attributes: ["id", "category", "description", "amount", "duration"],
    });
    res.status(200).json(listOfSubs);
  } catch (error) {
    next(error);
  }
});

//update the specific record
router.put("/update/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, amount, duration, description } = req.body;
    const subscription = await Subscription.update(
      {
        category: category,
        amount: amount,
        duration: duration,
        description: description,
      },
      { where: { id: id } }
    );
    res.status(201).send({ message: "Successfully updated" });
  } catch (error) {
    next(error);
  }
});

//delete the specific record
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const sub = await Subscription.destroy({
      where: { id: id },
    });
    res.status(200).send({ message: "Deleted successfully", subs: sub });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
