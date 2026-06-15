const express = require("express");
const { chat } = require("../controllers/chat");

const router = express.Router();

router.route("/").get(chat);

module.exports = router;
