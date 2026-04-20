const { ClientInfo } = require("../models");
const { generateUniqueQRCode } = require("./qrGenerator");
const { Op } = require("sequelize");

const populateMissingQRCodes = async () => {
  try {
    const clientsWithoutQR = await ClientInfo.findAll({
      where: {
        [Op.or]: [
          { qrCode: null },
          { qrCode: "" }
        ]
      }
    });

    if (clientsWithoutQR.length > 0) {
      console.log(`Found ${clientsWithoutQR.length} clients without QR codes. Generating...`);
      for (const client of clientsWithoutQR) {
        const newQrCode = await generateUniqueQRCode();
        await client.update({ qrCode: newQrCode });
      }
      console.log("Successfully populated QR codes for all clients.");
    }
  } catch (error) {
    console.error("Error during QR code migration:", error);
  }
};

module.exports = { populateMissingQRCodes };
