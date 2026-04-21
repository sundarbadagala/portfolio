const express = require("express");
const { getAllTags } = require("../controllers/tags");

const router = express.Router();

router.route("/").get(getAllTags);

module.exports = router