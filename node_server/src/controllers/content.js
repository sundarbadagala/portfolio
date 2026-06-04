const slugify = require("slugify");
const { stripHTMLTags } = require("../utils/helpers");
const { getNanoId } = require("../utils/methods");

const User = require("../models/user");
const Content = require("../models/content");
const Tags = require("../models/tags");

/**
 * @desc post content
 * @path POST /api/v1/content
 * @access private
 */
function parseTags(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return [];
  try {
    return JSON.parse(raw);
  } catch {
    try {
      return JSON.parse(raw.replace(/'/g, '"'));
    } catch {
      return [];
    }
  }
}

async function postContent(req, res, next) {
  try {
    const { content, tags: rawTags, title, headlines, groupby } = req.body;
    if (!content || !rawTags || !title || !headlines) {
      res.status(400);
      throw new Error("All fiels are mandatory");
    }
    const tags = parseTags(rawTags);
    if (!tags.length) {
      res.status(400);
      throw new Error("tags must be a non-empty array of { value, label } objects");
    }
    // Validate each tag has value and label properties
    const allTagsValid = tags.every(tag => 
      tag && typeof tag === 'object' && 'value' in tag && 'label' in tag
    );
    if (!allTagsValid) {
      res.status(400);
      throw new Error("each tag must have { value, label } properties");
    }
    const user = await User.findById(req.user.id);
    const nanoidFn = await getNanoId();
    const id = nanoidFn(8).toUpperCase();
    const slug = slugify(title, {
      lower: true,
      strict: true
    });
    const newContent = new Content({
      content_id: id,
      slug: slug,
      user: req.user.id,
      username: user.email,
      content,
      tags,
      title,
      headlines,
      ...(groupby && { groupby })
    });
    await newContent.save();
    return res.sendSuccess(newContent);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc get all content
 * @path GET /api/v1/content
 * @access public
 */
async function getContent(req, res, next) {
  try {
    const allContent = await Content.find(
      // {},
      // "content title tags date highlight headlines"
    );
    if (!allContent) {
      res.status(404);
      throw new Error("Content not found");
    }
    return res.sendSuccess(allContent);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc get content by Id
 * @path GET /api/v1/content/:id
 * @access public
 */
async function getContentById(req, res, next) {
  try {
    const { id } = req.params;
    const contentId = id.slice(-8);
    const content = await Content.findOne({ content_id: contentId });
    if (!content) {
      res.status(404);
      throw new Error("Content not found");
    }
    return res.sendSuccess(content);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc delete content by Id
 * @path DELETE /api/v1/content/:id
 * @access private
 */
async function deleteContentById(req, res, next) {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      res.status(400);
      throw new Error("Conent not found");
    }
    return res.sendSuccess(content, "successfully deleted");
  } catch (error) {
    next(error);
  }
}

/**
 * @desc search content by query param title or tags
 * @path GET api/v1/content/search?title=/tags=
 * @access public
 */
async function getSeachContent(req, res, next) {
  try {
    const { title, tags } = req.query;
    if (!title && !tags) {
      res.status(400);
      throw new Error("Params are missing");
    }
    const payload = title
      ? { title: new RegExp(title, "i") }
      : tags
      ? { "tags.value": new RegExp(tags, "i") }
      : {};
    const content = await Content.find(payload, "content title tags date slug content_id headlines");
    return res.sendSuccess(content);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postContent,
  getContent,
  getContentById,
  deleteContentById,
  getSeachContent
};
