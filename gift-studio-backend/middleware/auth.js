const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Checks the login token. If it is valid, adds the logged-in user to req.user
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Please log in first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // The user must still exist. Role is read from the database, not from the token.
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "This account no longer exists" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Your session has expired. Please log in again" });
    }
    if (err.name === "JsonWebTokenError" || err.name === "CastError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    next(err);
  }
}

// Allows only the listed roles, for example requireRole("admin")
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission to do this" });
    }
    next();
  };
}

module.exports = { protect, requireRole };