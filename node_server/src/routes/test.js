const express = require("express");
const jwt = require("jsonwebtoken");
const jwtCookieHandler = require("../middleware/jwtCookieHandler");
const {
  getAvailableSubjects,
  generateTest,
  getAllTests,
  getTestById,
  deleteTest,
  submitTest
} = require("../controllers/test");

const router = express.Router();

/**
 * Optional auth middleware to attach user if logged in without blocking visitors
 */
function optionalAuth(req, res, next) {
  try {
    let token = req.cookies ? req.cookies.token : null;
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key) acc[key] = decodeURIComponent(value);
        return acc;
      }, {});
      token = cookies.token;
    }
    if (!token) token = req.header("x-token");
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
      const decode = jwt.verify(token, process.env.JWT_KEY);
      req.user = decode.user;
    }
  } catch (err) {
    // Ignore error for optional auth
  }
  next();
}

// 1st API: Get all available subjects (JavaScript, React.js, Next.js, CSS, HTML, etc.)
router.route("/subjects").get(getAvailableSubjects);

// 2nd API: Generate AI-powered test questions
router.route("/generate").post(generateTest);

// 3rd API: Submit answered test, compute score, and clear from Redis
router.route("/submit").post(submitTest);
router.route("/submit-test").post(submitTest);

// Base route: GET all tests, POST to generate
router.route("/")
  .get(getAllTests)
  .post(generateTest);

// Single test by test_id or _id
router.route("/:id")
  .get(getTestById)
  .delete(jwtCookieHandler, deleteTest);

module.exports = router;
