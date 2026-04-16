const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const { User } = require("../models");
const { sign } = require("jsonwebtoken");
const { validateToken, authorize } = require("../AuthMiddleware/Auth");

//create new user account
router.post(
  "/new",
  validateToken,
  authorize(["superadmin", "admin"]),
  async (req, res, next) => {
    try {
      //body username, password, fullname, contactno, address, role
      const { username, password, fullname, contact, address, role } = req.body;
      const creatorRole = req.user.user.role;

      // Role creation hierarchy logic
      let canCreate = false;
      if (creatorRole === "superadmin") {
        canCreate = true; // Can create admin, staff, user
      } else if (creatorRole === "admin") {
        if (role === "staff" || role === "user") {
          canCreate = true;
        }
      }

      if (!canCreate) {
        return res.status(403).json({
          error: `Access Denied: You are not allowed to create a user with the '${role}' role.`,
        });
      }

      //hash the password using bycryptjs
      const hashPass = await bcrypt.hash(password, 10);
      await User.create({
        username: username,
        password: hashPass,
        fullname: fullname,
        contactno: contact,
        address: address,
        role: role,
      });

      res.status(201).send({
        message: "Account successfully created.",
      });
    } catch (error) {
      next(error);
    }
  },
);

//login
router.post("/login", async (req, res, next) => {
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
    const match = await bcrypt.compare(password, user.password);
    //if not match
    if (!match) return res.send({ error: "Invalid Username or Password" });
    //create an access token if match
    const accessToken = sign({ user: user }, process.env.JWT_SECRET);
    res
      .status(200)
      .send({ token: accessToken, user: user, message: "Login Successful" });
  } catch (error) {
    next(error);
  }
});

router.get("/", validateToken, (req, res, next) => {
  res.status(200).json(req.user);
});

module.exports = router;
