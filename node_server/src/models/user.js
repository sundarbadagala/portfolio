const mongoose = require("mongoose");
const { createHmac } = require("crypto");

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add user name"],
      trim: true,
      minlength: [3, "User name must be at least 3 characters"]
    },
    email: {
      type: String,
      required: [true, "Please add emain"],
      unique: true,
      lowercase:true,
    },
    password: {
      type: String,
      required: [true, "Please add password"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    isAdmin: {
      type: Boolean,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "admin"
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  { collection: "user-data" }
);

module.exports = mongoose.model("user", User);
