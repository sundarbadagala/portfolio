const { executeCode } = require("../utils/methods");

async function postCompiler(req, res, next) {
  try {
    const { language, language_id, stdin, source_code } = req.body;
    const response = await executeCode(source_code, language_id, "");
    console.log('---', response);
    res.sendSuccess(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postCompiler
};
