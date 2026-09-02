const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema(
  {
    options_id: {
      type: String,
      required: true
    },
    option_1: {
      type: String,
      required: true
    },
    option_text: {
      type: String
    },
    is_correct: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    question_id: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    options: {
      type: [OptionSchema],
      validate: [
        (val) => Array.isArray(val) && val.length === 4,
        "Question must have exactly 4 options"
      ]
    },
    subject: {
      type: String,
      required: true
    },
    concept: {
      type: String,
      required: true
    },
    hint: {
      type: String,
      default: ""
    },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "medium", "advanced"]
    },
    marks: {
      type: Number,
      default: 1
    },
    question_type: {
      type: String,
      default: "single_select"
    }
  },
  { _id: false }
);

const TestSchema = new mongoose.Schema(
  {
    test_id: {
      type: String,
      unique: true,
      index: true,
      required: true
    },
    subject: {
      type: String,
      required: true,
      index: true
    },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "medium", "advanced"],
      index: true
    },
    number_of_questions: {
      type: Number,
      required: true
    },
    questions: {
      type: [QuestionSchema],
      required: true
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null
    }
  },
  { collection: "tests", timestamps: true }
);

TestSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

TestSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("test", TestSchema);
