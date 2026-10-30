require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const sanitizeBody = require("./middleware/sanitize");
const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// Behind a hosting proxy (like Render) the real visitor IP comes from a header
if (isProduction) app.set("trust proxy", 1);

// 1. Security headers
app.use(helmet());

// 2. CORS: only our own website(s) may call the API from a browser
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header means Postman, curl or another server: allow
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      const err = new Error("This website is not allowed to use the API");
      err.status = 403;
      callback(err);
    },
  })
);

// 3. Request log (shows every request in the terminal)
app.use(morgan(isProduction ? "combined" : "dev"));

// 4. Rate limit: a limited number of requests per visitor in a time window
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again in a few minutes." },
  })
);

// 5. Small body size + remove dangerous keys
app.use(express.json({ limit: "10kb" }));
app.use(sanitizeBody);

// Health-check route
app.get("/", (req, res) => {
  res.json({ message: "Gift Studio API is running" });
});

// API routes
app.use("/api/products", productRoutes);

// Unknown URL -> clean JSON instead of an HTML error page
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Central error handler
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body is too large" });
  }
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

async function start() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing. Check your .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected: " + mongoose.connection.name);

    app.listen(PORT, () => {
      console.log("Server running on http://localhost:" + PORT);
    });
  } catch (err) {
    console.error("MongoDB connection failed: " + err.message);
    console.error("Check: password in .env, Network Access (0.0.0.0/0) in Atlas, or try a mobile hotspot.");
    process.exit(1);
  }
}

start();