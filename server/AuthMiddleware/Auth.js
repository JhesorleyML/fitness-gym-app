const { verify } = require("jsonwebtoken");
const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.send({ error: "User is not login" });
  else {
    try {
      const validToken = verify(accessToken, process.env.JWT_SECRET);
      req.user = validToken;
      if (validToken) {
        return next();
      }
    } catch (error) {
      return res.json({ error: error });
    }
  }
};

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // Assuming req.user is populated by validateToken as { user: { role, ... } }
    if (!req.user || !req.user.user || !allowedRoles.includes(req.user.user.role)) {
      return res.status(403).json({ error: "Access Denied: Unauthorized Role" });
    }
    next();
  };
};

module.exports = { validateToken, authorize };
