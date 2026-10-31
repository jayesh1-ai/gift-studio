require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// Creates the first admin account. The email and password come from the .env file,
// so they are never written inside the code.
async function createAdmin() {
  const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Missing MONGO_URI, ADMIN_EMAIL or ADMIN_PASSWORD in your .env file.");
    process.exit(1);
  }
  if (ADMIN_PASSWORD.length < 8 || ADMIN_PASSWORD.length > 72) {
    console.error("ADMIN_PASSWORD must be between 8 and 72 characters.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const existing = await User.findOne({ email });

    if (existing) {
      await User.updateOne({ email }, { role: "admin" });
      console.log("This email already had an account. It is now an admin: " + email);
    } else {
      const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await User.create({ name: ADMIN_NAME || "Admin", email, password: hash, role: "admin" });
      console.log("Admin account created: " + email);
    }
  } catch (err) {
    console.error("Could not create admin: " + err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();