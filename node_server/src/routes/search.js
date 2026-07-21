const express = require("express");
const { ragSearchContent } = require("../controllers/search");

const router = express.Router();

router.route("/").get(ragSearchContent);

module.exports = router;
