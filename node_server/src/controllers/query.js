const Query = require("../models/query");
const { mailSender } = require("../utils/methods");
const { PostQueryDto } = require("../dto/query.dto");

/**
 * @desc post query
 * @path POST /api/v1/query
 * @access public
 */
async function postQuery(req, res, next) {
  try {
    const dto = new PostQueryDto(req.body);
    dto.validate();
    const { sender, mail, query } = dto;

    const newQuery = new Query({
      sender,
      mail,
      query,
    });
    await newQuery.save();

    res.sendSuccess("query sent successfully");

    // Send confirmation email in background to prevent SMTP network issues from blocking response
    mailSender(mail, sender).catch((err) => {
      console.error("Background email delivery failed:", err.message);
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postQuery,
};
