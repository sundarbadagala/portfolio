module.exports = function (err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    status: "error",
    message: message,
    data: null,
    stack: err.stack
  });
};
