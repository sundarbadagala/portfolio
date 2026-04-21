const fs = require("fs");

module.exports = function (req, res, next) {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}:${req.ip} ${req.method}: ${req.path}\n`,
    (err, data) => {
      next();
    }
  );
};
