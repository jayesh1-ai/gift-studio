const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

function isValidId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// 10 digit ya 91 ke saath 12 digit number accept, 91XXXXXXXXXX format mein save
function normalizePhone(raw) {
  const d = String(raw ?? "").replace(/\D/g, "");
  if (/^[6-9]\d{9}$/.test(d)) return "91" + d;
  if (/^91[6-9]\d{9}$/.test(d)) return d;
  return null;
}

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { name, phone, items } = req.body;

    if (typeof name !== "string" || name.trim().length < 2 || name.length > 80) {
      return res.status(400).json({ error: "Please enter your name" });
    }
    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone) {
      return res.status(400).json({ error: "Please enter a valid 10 digit mobile number" });
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
      return res.status(400).json({ error: "Cart is empty or too large" });
    }

    // Price hamesha database se
    const lines = [];
    let total = 0;

    for (const it of items) {
      const qty = Number(it.quantity);
      if (!isValidId(String(it.productId)) || !Number.isInteger(qty) || qty < 1 || qty > 20) {
        return res.status(400).json({ error: "Invalid item in cart" });
      }
      const product = await Product.findById(it.productId);
      if (!product) return res.status(400).json({ error: "A product no longer exists" });

      total += product.price * qty;
      lines.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        customText: String(it.customText ?? "").slice(0, 200),
        colorName: String(it.colorName ?? "").slice(0, 40),
        hasPhoto: Boolean(it.hasPhoto),
      });
    }

    const orderId =
      "GS-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase();

    await Order.create({
      orderId,
      name: name.trim(),
      phone: cleanPhone,
      items: lines,
      total,
    });

    res.status(201).json({ orderId, total, items: lines });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
});

// GET /api/orders -> saare orders (sirf admin)
router.get("/", protect, requireRole("admin"), async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
});

module.exports = router;