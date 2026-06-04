const express = require("express");
const { getAllTags, getGroupBy } = require("../controllers/tags");

const router = express.Router();

router.route("/all-tags").get(getAllTags);
router.route("/groupby").get(getGroupBy);

module.exports = router;
