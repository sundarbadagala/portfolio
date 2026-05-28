module.exports = function (err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    status: "error",
    message,
    data: null,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
};
