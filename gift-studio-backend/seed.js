require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Photo Cushion",
    price: 699,
    category: "Cushions",
    forWho: ["partner", "parent", "friend"],
    occasions: ["birthday", "anniversary", "housewarming"],
    custom: { kind: "cushion", photo: "optional", maxChars: 120, palette: "ink", textLabel: "Caption", defaultText: "Love you always" },
  },
  {
    name: "LED Name Cushion",
    price: 999,
    category: "Cushions",
    forWho: ["partner", "friend"],
    occasions: ["birthday", "anniversary"],
    custom: { kind: "cushion", glow: true, photo: "none", maxChars: 40, palette: "ink", textLabel: "Name", colorLabel: "Glow colour", defaultText: "Aarav" },
  },
  {
    name: "Photo Mug",
    price: 349,
    category: "Mugs",
    forWho: ["friend", "parent", "self"],
    occasions: ["birthday", "justbecause"],
    custom: { kind: "mug", photo: "optional", maxChars: 120, palette: "ink", textLabel: "Message", defaultText: "Best day ever" },
  },
  {
    name: "Couple Mug Set",
    price: 599,
    category: "Mugs",
    forWho: ["partner"],
    occasions: ["anniversary", "justbecause"],
    custom: { kind: "mug", photo: "none", maxChars: 60, palette: "ink", textLabel: "Names", defaultText: "Aarav & Riya" },
  },
  {
    name: "Custom Caricature Portrait",
    price: 1499,
    category: "Caricatures",
    forWho: ["friend", "partner", "parent"],
    occasions: ["birthday", "anniversary"],
    custom: { kind: "caricature", photo: "required", textRequired: false, maxChars: 80, palette: "ink", textLabel: "Caption (optional)", defaultText: "Happy Birthday" },
  },
  {
    name: "Custom Name Neon Sign",
    price: 2499,
    category: "Neon Lights",
    forWho: ["friend", "self", "partner"],
    occasions: ["housewarming", "birthday"],
    custom: { kind: "neon", photo: "none", maxChars: 60, palette: "ink", textLabel: "Neon text", colorLabel: "Neon colour", defaultText: "Happy Birthday" },
  },
  {
    name: "Engraved Photo Keychain",
    price: 299,
    category: "Keychains",
    forWho: ["partner", "friend", "parent", "self"],
    occasions: ["justbecause", "anniversary"],
    custom: { kind: "keychain", photo: "optional", maxChars: 30, palette: "metal", textLabel: "Engraving", defaultText: "Forever us" },
  },
  {
    name: "Custom Name Necklace",
    price: 1299,
    category: "Jewellery",
    forWho: ["partner", "parent"],
    occasions: ["anniversary", "birthday"],
    custom: { kind: "necklace", photo: "none", maxChars: 12, palette: "metal", textLabel: "Name on pendant", defaultText: "Aarav" },
  },
  {
    name: "Engraved Wooden Frame",
    price: 899,
    category: "Home Decor",
    forWho: ["parent", "partner"],
    occasions: ["housewarming", "anniversary"],
    custom: { kind: "frame", photo: "optional", maxChars: 100, palette: "ink", textLabel: "Engraved caption", defaultText: "Our happy place" },
  },
  {
    name: "Personalized Photo Lamp",
    price: 1199,
    category: "Home Decor",
    forWho: ["partner", "parent", "friend"],
    occasions: ["housewarming", "birthday", "anniversary"],
    custom: { kind: "lamp", photo: "optional", maxChars: 60, palette: "ink", textLabel: "Message", colorLabel: "Glow colour", defaultText: "Goodnight" },
  },
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing. Check your .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    // Start fresh, then insert all products
    await Product.deleteMany({});
    const created = await Product.insertMany(products);

    console.log("Done! " + created.length + " products added to database: " + mongoose.connection.name);
  } catch (err) {
    console.error("Seeding failed: " + err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
