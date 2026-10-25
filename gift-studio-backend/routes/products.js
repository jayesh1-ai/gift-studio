const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// A real MongoDB id is exactly 24 hex characters
function isValidId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Only these fields can be set from outside (ignores anything extra)
function pickFields(body) {
  const allowed = ["name", "price", "category", "forWho", "occasions", "custom"];
  const data = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  return data;
}

function handleError(err, res) {
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }
  console.error(err);
  return res.status(500).json({ error: "Something went wrong on the server" });
}

// GET /api/products           -> all products
// GET /api/products?category=Mugs -> only one category
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (typeof req.query.category === "string") {
      filter.category = req.query.category;
    }
    const products = await Product.find(filter).sort({ createdAt: 1, _id: 1 });
    res.json(products);
  } catch (err) {
    handleError(err, res);
  }
});

// GET /api/products/:id       -> one product
router.get("/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid product id" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    handleError(err, res);
  }
});

// POST /api/products          -> add a product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(pickFields(req.body));
    res.status(201).json(product);
  } catch (err) {
    handleError(err, res);
  }
});

// PUT /api/products/:id       -> update a product
router.put("/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid product id" });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, pickFields(req.body), {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE /api/products/:id    -> delete a product
router.delete("/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid product id" });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;