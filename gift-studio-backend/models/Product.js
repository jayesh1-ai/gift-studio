const mongoose = require("mongoose");

const customSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      required: true,
      enum: ["cushion", "mug", "caricature", "neon", "keychain", "necklace", "frame", "lamp"],
    },
    glow: { type: Boolean, default: false },
    photo: { type: String, enum: ["optional", "required", "none"], default: "optional" },
    textRequired: { type: Boolean, default: true },
    maxChars: { type: Number, default: 120, min: 1, max: 500 },
    palette: { type: String, enum: ["ink", "metal"], default: "ink" },
    textLabel: { type: String, default: "Message" },
    colorLabel: { type: String },
    defaultText: { type: String, default: "" },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },
    price: { type: Number, required: [true, "Price is required"], min: [0, "Price cannot be negative"] },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Cushions", "Mugs", "Caricatures", "Neon Lights", "Keychains", "Jewellery", "Home Decor"],
    },
    forWho: [{ type: String, enum: ["partner", "friend", "parent", "self"] }],
    occasions: [{ type: String, enum: ["birthday", "anniversary", "housewarming", "justbecause"] }],
    custom: { type: customSchema, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret._id;
      },
    },
  }
);

module.exports = mongoose.model("Product", productSchema);