const express = require("express");
const { getQOT } = require("../controllers/qot");

const router = express.Router();

router.route("/").get(getQOT);

module.exports = router