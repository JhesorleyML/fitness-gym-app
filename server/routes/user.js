const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const { User } = require("../models");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../AuthMiddleware/Auth");
//create new user account
router.post("/new", async (req, res) => {
  try {
    //body username, password, fullname, contactno, address, role
    const { username, password, fullname, contact, address, role } = req.body;
    //hash the password using bycryptjs
    bcrypt.hash(password, 10).then((hashPass) => {
      User.create({
        username: username,
        password: hashPass,
        fullname: fullname,
        contactno: contact,
        address: address,
        role: role,
      });
    });
    //store the data to the database

    res.status(201).send({
      message: "Account successfully created.",
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occured while creating new account",
      error,
    });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({
      attributes: [
        "id",
        "fullname",
        "role",
        "address",
        "contactNo",
        "username",
        "password",
      ],
      where: { username: username },
    });
    //let isLoginSuccess = false;
    if (!user) {
      return res.send({ error: "Invalid Username or Password" });
    }
    console.log(user);
    //else  if username is found compare the password and the hash
    bcrypt.compare(password, user.password).then((match) => {
      //if not match
      if (!match) return res.send({ error: "Invalid Username or Password" });
      //create an access token if match
      const accessToken = sign({ user: user }, "s3cretKey");
      res
        .status(200)
        .send({ token: accessToken, user: user, message: "Login Successful" });
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occured while accessing user details during login.",
    });
  }
});

router.get("/", validateToken, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
