const mongoose = require("mongoose");

const Tags = mongoose.Schema(
  {
    tags: {
      type: [String],
    },
  },
  { collection: "tags" }
);

module.exports = mongoose.model("tags", Tags);
