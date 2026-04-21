const express = require("express");
const jwtHandler = require("../middleware/jwtHandler");
const {
  loginUser,
  getUser,
  registerUser,
  updateUser,
} = require("../controllers/user");

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/details").get(jwtHandler, getUser).put(jwtHandler, updateUser);

module.exports = router;
