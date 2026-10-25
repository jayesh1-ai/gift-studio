require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

// Bad JSON in a request body, or any other unexpected error
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
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