function responseHandler(req, res, next) {
  res.sendSuccess = (data, message = "", statusCode = 200) => {
    return res.status(statusCode).json({
      status: "success",
      message,
      data
    });
  };
  next();
}

module.exports = responseHandler;
