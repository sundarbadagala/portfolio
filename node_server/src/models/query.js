const mongoose = require("mongoose");

const Query = mongoose.Schema(
  {
    sender: {
      type: String,
      reqiured: true,
    },
    mail: {
      type: String,
      reqiured: true,
    },
    query: {
      type: String,
      reqiured: true,
    },
  },
  {
    collection: "queries",
  }
);

module.exports = mongoose.model("query", Query);
