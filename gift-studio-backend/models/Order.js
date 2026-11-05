const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    customText: { type: String, default: "" },
    colorName: { type: String, default: "" },
    hasPhoto: { type: Boolean, default: false },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    items: { type: [itemSchema], required: true },
    total: { type: Number, required: true },
    status: { type: String, default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);