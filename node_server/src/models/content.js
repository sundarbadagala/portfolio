const mongoose = require("mongoose");

const Content = new mongoose.Schema(
  {
    content_id: {
      type: String,
      unique: true,
      index: true,
      required: true
    },
    slug: {
      type: String,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    username: {
      type: String,
      required: true
    },
    content: {
      type: String,
      require: true
    },
    highlight: {
      type: String
    },
    headlines: {
      type: String,
      require: true
    },
    title: {
      type: String,
      require: true
    },
    tags: {
      type: [String],
      require: true
    },
    date: {
      type: Date,
      default: Date.now()
    }
  },
  { collection: "content", timestamps: true }
);

Content.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

Content.set("toObject", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret._v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

module.exports = mongoose.model("content", Content);
