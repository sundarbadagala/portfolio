const Tags = require("../models/tags");
const Content = require("../models/content");

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
    return res.sendSuccess(allTags[0].tags);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc get unique tags from all content documents
 * @path GET /api/v1/all-tags
 * @access public
 */
async function getAllContentTags(req, res, next) {
  try {
    const result = await Content.distinct("tags");
    return res.sendSuccess(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllTags, getAllContentTags };
