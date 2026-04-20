const { ClientInfo } = require("../models");

/**
 * Generates a unique 10-digit numeric string for QR codes.
 * Checks against the database to ensure uniqueness.
 */
const generateUniqueQRCode = async () => {
  let unique = false;
  let qrCode = "";

  while (!unique) {
    // Generate a 10-digit random number as a string
    qrCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    // Check if it already exists in the database
    const existingClient = await ClientInfo.findOne({ where: { qrCode } });
    if (!existingClient) {
      unique = true;
    }
  }

  return qrCode;
};

module.exports = { generateUniqueQRCode };
