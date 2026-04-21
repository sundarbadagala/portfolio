const express = require("express");
const { postQuery } = require("../controllers/query");

const router = express.Router();

router.route("/").post(postQuery);

module.exports = router