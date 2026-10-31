const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Used when the email does not exist, so a wrong email and a wrong password
// take the same time and give the same answer (nobody can find which emails exist)
const DUMMY_HASH = "$2b$12$VyPjeQXa37TvwgA6TBwv1OHQASnoNaxPwnOJ3TuDtLDhmxllm.lnG";

function signToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

function handleError(err, res) {
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid value for '" + err.path + "'" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }
  console.error(err);
  return res.status(500).json({ error: "Something went wrong on the server" });
}

// POST /api/auth/register  -> create a customer account
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (typeof password !== "string" || password.length < 8 || password.length > 72) {
      return res.status(400).json({
        error: "Validation failed",
        details: ["Password must be between 8 and 72 characters"],
      });
    }

    const hash = await bcrypt.hash(password, 12);

    // The role is never taken from the request: everyone who signs up is a customer
    const user = await User.create({ name, email, password: hash });

    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    handleError(err, res);
  }
});

// POST /api/auth/login  -> check email and password, give back a token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    const passwordOk = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

    if (!user || !passwordOk) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ token: signToken(user), user });
  } catch (err) {
    handleError(err, res);
  }
});

// GET /api/auth/me  -> who am I? (needs a valid token)
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;