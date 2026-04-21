const Query = require("../models/query");
const { mailSender } = require("../utils/methods");

/**
 * @desc post query
 * @path POST /api/v1/query
 * @access public
 */
async function postQuery(req, res, next) {
  try {
    const { sender, mail, query } = req.body;
    if (!sender || !mail || !query) {
      res.status(400);
      throw new Error("insufficient details");
    }
    const sendRes = await mailSender(mail, sender);
    if (sendRes) {
      const newQuery = new Query({
        sender,
        mail,
        query,
      });
      await newQuery.save();
      res.status(200).json({
        status: "success",
        message: "",
        data: "query send successfully",
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postQuery,
};
