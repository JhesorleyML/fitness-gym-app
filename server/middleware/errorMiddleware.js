const { logError } = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  // 1. Log the error server-side for internal review
  logError(err, req);
  console.error(`[Error] ${req.method} ${req.url}:`, err.message);

  // 2. Set the response status code (default to 500)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // 3. Send a standardized JSON response
  const response = {
    status: "error",
    message: err.message || "An unexpected error occurred.",
    // Only include stack trace and full error details in development
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err,
    }),
  };

  res.json(response);
};

module.exports = errorHandler;
