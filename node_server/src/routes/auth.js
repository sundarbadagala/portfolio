const express = require("express");
const jwtCookieHandler = require("../middleware/jwtCookieHandler");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", jwtCookieHandler, getMe);

module.exports = router;
