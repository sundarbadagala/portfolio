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
    const sendRes = await mailSender(mail, sender);
    if (sendRes) {
      const newQuery = new Query({
        sender,
        mail,
        query,
      });
      await newQuery.save();
      return res.sendSuccess("query send successfully");
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postQuery,
};
