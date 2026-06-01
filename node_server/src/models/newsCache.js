const mongoose = require("mongoose");

const NewsCache = new mongoose.Schema(
  {
    articles: {
      type: Array,
      required: true
    }
  },
  { collection: "news_cache", timestamps: true }
);

module.exports = mongoose.model("news_cache", NewsCache);
