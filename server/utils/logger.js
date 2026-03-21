const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../../logs/error.log");

/**
 * Logs error details to a file with a timestamp.
 */
const logError = (err, req = null) => {
  const timestamp = new Date().toISOString();
  const method = req ? req.method : "N/A";
  const url = req ? req.url : "N/A";
  
  const logMessage = `[${timestamp}] ${method} ${url}\nError: ${err.message}\nStack: ${err.stack}\n------------------------------------------------------------\n`;

  // Append error to log file
  fs.appendFile(logFile, logMessage, (error) => {
    if (error) {
      console.error("Failed to write to log file:", error);
    }
  });
};

module.exports = { logError };
