const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be at most 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two accounts can share an email
      lowercase: true, // Aarav@Mail.com and aarav@mail.com are the same person
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    // Stores the HASH of the password, never the real password
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // hidden from normal queries
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.password; // never send the hash out
      },
    },
  }
);

module.exports = mongoose.model("User", userSchema);