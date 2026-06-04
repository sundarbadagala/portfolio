const Tags = require("../models/tags");
const Content = require("../models/content");

/**
 * @desc get all content tags
 * @path GET /api/v1/filters/tags
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
 * @path GET /api/v1/filters/all-tags
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



/**
 * @desc get all unique groupby values
 * @path GET /api/v1/filters/groupby
 * @access public
 */
async function getGroupBy(req, res, next) {
  try {
    const groupbyValues = await Content.distinct("groupby", { groupby: { $exists: true, $ne: null } });
    return res.sendSuccess(groupbyValues);
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllTags, getAllContentTags, getGroupBy };
