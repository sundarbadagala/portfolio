module.exports = function (req, res, next) {
  res.status(404);
  throw new Error("URL not found");
};
