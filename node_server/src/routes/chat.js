const express = require("express");
const { chat } = require("../controllers/chat");

const router = express.Router();

router.route("/").post(chat);

module.exports = router;
