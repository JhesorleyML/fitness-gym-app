const { verify } = require("jsonwebtoken");
const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.send({ error: "User is not login" });
  else {
    try {
      const validToken = verify(accessToken, "s3cretKey");
      req.user = validToken;
      if (validToken) {
        return next();
      }
    } catch (error) {
      return res.json({ error: error });
    }
  }
};

module.exports = { validateToken };
