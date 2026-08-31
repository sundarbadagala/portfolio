const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ChatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
    collection: "chat-sessions",
  }
);

ChatSessionSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model("chatSession", ChatSessionSchema);
