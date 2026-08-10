const mongoose = require("mongoose");

const QandASchema = new mongoose.Schema(
  {
    question_id: {
      type: String,
      unique: true,
      index: true,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    sub_category: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      immutable: true
    }
  },
  { collection: "q&a", timestamps: true }
);

QandASchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

QandASchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

module.exports = mongoose.model("qanda", QandASchema);
