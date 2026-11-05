require("dotenv").config();

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const WebSocket = require("ws");

const sanitizeBody = require("./middleware/sanitize");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders"); // NEW

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// Behind a hosting proxy
if (isProduction) app.set("trust proxy", 1);

// 1. Security headers
app.use(helmet());

// 2. CORS
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman, curl, and server-to-server requests
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const err = new Error("This website is not allowed to use the API");
      err.status = 403;
      callback(err);
    },
  })
);

// 3. Request logging
app.use(morgan(isProduction ? "combined" : "dev"));

// 4. API rate limit
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      error: "Too many requests. Please try again in a few minutes.",
    },
  })
);

// Stricter rate limit for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Please try again in a few minutes.",
  },
});

// 5. JSON body parser and sanitization
app.use(express.json({ limit: "10kb" }));
app.use(sanitizeBody);

// Health-check route
app.get("/", (req, res) => {
  res.json({ message: "Gift Studio API is running" });
});

// API routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes); // NEW

// 6. WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");

  // Send a welcome message to the connected client
  ws.send(
    JSON.stringify({
      type: "welcome",
      message: "Connected to Gift Studio WebSocket server",
    })
  );

  // Receive messages from the client
  ws.on("message", (data) => {
    const message = data.toString();

    console.log("Received WebSocket message:", message);

    // Broadcast message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "message",
            message: message,
          })
        );
      }
    });
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });

  // Handle WebSocket errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error.message);
  });
});

// Unknown URL
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Central error handler
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON in request body",
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      error: "Request body is too large",
    });
  }

  if (err.status && err.status < 500) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    error: "Something went wrong on the server",
  });
});

// 7. Start server and connect MongoDB
async function start() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing. Check your .env file.");
    process.exit(1);
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error(
      "JWT_SECRET is missing or too short (use at least 32 characters). Check your .env file."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected: " + mongoose.connection.name);

    // Start HTTP and WebSocket server on the same port
    server.listen(PORT, () => {
      console.log("Server running on http://localhost:" + PORT);
      console.log("WebSocket server running on ws://localhost:" + PORT);
    });
  } catch (err) {
    console.error("MongoDB connection failed: " + err.message);
    console.error(
      "Check: password in .env, Network Access (0.0.0.0/0) in Atlas, or try a mobile hotspot."
    );

    process.exit(1);
  }
}

start();