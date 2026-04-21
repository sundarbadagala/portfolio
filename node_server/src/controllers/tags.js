const Tags = require("../models/tags");

/**
 * @desc get all content tags
 * @path GET /api/v1/tags
 * @access public
 */
async function getAllTags(req, res, next) {
  try {
    const allTags = await Tags.find({}, "tags");
    if (!allTags) {
      res.status(400);
      throw new Error("No Tags available");
    }
    return res.status(200).json({
      status: "success",
      message: "",
      data: allTags[0].tags,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllTags };
