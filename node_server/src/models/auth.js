const mongoose = require("mongoose");

const Auth = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add user name"],
      trim: true,
      minlength: [3, "User name must be at least 3 characters"]
    },
    email: {
      type: String,
      required: [true, "Please add email"],
      unique: true,
      lowercase: true,
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
    isUser: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true
    }
  },
  { collection: "auth-data" }
);

module.exports = mongoose.model("auth", Auth);
