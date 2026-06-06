const express = require("express");
const { getAllTags, getGroupBy, getAllContentTags } = require("../controllers/tags");

const router = express.Router();

router.route("/tags").get(getAllTags);
router.route('/all-tags').get(getAllContentTags)
router.route("/groupby").get(getGroupBy);

module.exports = router;
