const express = require("express");
const app = express();
const db = require("./models");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

//port
const PORT = process.env.PORT || 3005;

//import routes
const clientRouter = require("./routes/clientInfo");
const subsRouter = require("./routes/subscription");
const clientSubsRouter = require("./routes/clientSubscription");
const paymentRouter = require("./routes/payment");
const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expense");
const attendanceRouter = require("./routes/attendance");
const errorHandler = require("./middleware/errorMiddleware");

//express middleware to parse json from body
app.use(express.json());
app.use(cors());
//set up static folder for serving images accessible via uploads routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
//pass the upload middleware to a specific routes in clientRouter
app.use("/api/clients", (req, res, next) => {
  req.upload = upload;
  next();
});
app.use("/api/expenses", (req, res, next) => {
  req.upload = upload;
  next();
});

app.use("/api/auth", userRouter);
app.use("/api/clients", clientRouter);
app.use("/api/subscriptions", subsRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/clientsubs", clientSubsRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/attendance", attendanceRouter);

const { populateMissingQRCodes } = require("./utils/migration");

// Global Error Handler
app.use(errorHandler);

db.sequelize.sync().then(async () => {
  // Run migration to populate missing QR codes for existing clients
  await populateMissingQRCodes();
  
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
