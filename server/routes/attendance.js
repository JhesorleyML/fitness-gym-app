const express = require("express");
const router = express.Router();
const { format } = require("date-fns");
const { Op } = require("sequelize");
const { Attendance, ClientInfo, ClientSubscription } = require("../models");

// Get attendance logs with optional date filter
router.get("/", async (req, res, next) => {
  try {
    const { date } = req.query;
    const searchDate = date || format(new Date(), "yyyy-MM-dd");

    const logs = await Attendance.findAll({
      where: { date: searchDate },
      include: [
        {
          model: ClientInfo,
          attributes: ["firstname", "lastname", "middlename", "pic"],
        },
      ],
      order: [["checkIn", "DESC"]],
    });

    const host = req.get("host");
    const protocol = req.protocol;
    const updatedLogs = logs.map((log) => {
      const logObj = log.toJSON();
      if (logObj.ClientInfo && logObj.ClientInfo.pic) {
        logObj.ClientInfo.pic = `${protocol}://${host}/uploads/${logObj.ClientInfo.pic}`;
      }
      return logObj;
    });

    res.status(200).json(updatedLogs);
  } catch (error) {
    next(error);
  }
});

// Post scan for Check-In/Out
router.post("/scan", async (req, res, next) => {
  //get the host and protocol for constructing image URLs
  const host = req.get("host");
  const protocol = req.protocol;

  try {
    const { qrCode } = req.body;

    if (!qrCode) {
      return res.status(400).json({ message: "QR Code is required." });
    }

    // Step 1: Lookup Client by qrCode
    const client = await ClientInfo.findOne({
      where: { qrCode },
      attributes: ["id", "firstname", "lastname", "pic"],
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    // Step 2: Subscription Validation
    const today = format(new Date(), "yyyy-MM-dd");
    const activeSub = await ClientSubscription.findOne({
      where: {
        ClientInfoId: client.id,
        dateend: { [Op.gte]: today },
      },
      order: [["dateend", "DESC"]],
    });

    if (!activeSub) {
      return res.status(403).json({
        message:
          "Client does not have an active session left. Please proceed to the attendant for subscription payment",
        client: {
          fullname: `${client.firstname} ${client.lastname}`,
          pic: `${protocol}://${host}/uploads/${client.pic}`,
        },
      });
    }

    // Step 3: Check-In/Out Toggle logic
    const todayDate = format(new Date(), "yyyy-MM-dd");

    // Find active attendance record (checked in but not checked out) for TODAY
    const activeAttendance = await Attendance.findOne({
      where: {
        ClientInfoId: client.id,
        date: todayDate,
        checkOut: null,
      },
    });

    const now = new Date();

    if (activeAttendance) {
      // Perform Check-Out
      await activeAttendance.update({ checkOut: now });
      return res.status(200).json({
        message: "Check-out successful",
        type: "OUT",
        client: {
          fullname: `${client.firstname} ${client.lastname}`,
          pic: `${protocol}://${host}/uploads/${client.pic}`,
          expiry: activeSub.dateend,
        },
      });
    } else {
      // Perform Check-In
      await Attendance.create({
        ClientInfoId: client.id,
        checkIn: now,
        date: todayDate,
      });
      return res.status(200).json({
        message: "Check-in successful",
        type: "IN",
        client: {
          fullname: `${client.firstname} ${client.lastname}`,
          pic: `${protocol}://${host}/uploads/${client.pic}`,
          expiry: activeSub.dateend,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
