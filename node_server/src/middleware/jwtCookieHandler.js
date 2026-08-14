const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  try {
    // 1. Try to read token from cookies (requires cookie-parser)
    let token = req.cookies ? req.cookies.token : null;

    // 2. If cookie-parser hasn't run or token not in req.cookies, parse headers manually
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key) acc[key] = decodeURIComponent(value);
        return acc;
      }, {});
      token = cookies.token;
    }

    // 3. Fallback to header if cookie not present
    if (!token) {
      token = req.header("x-token");
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized access - No token provided",
        data: null
      });
    }

    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.user = decode.user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized access - Invalid or expired token",
      data: null
    });
  }
};
