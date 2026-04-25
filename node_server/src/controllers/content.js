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
async function postContent(req, res, next) {
  try {
    const { content, tags, title, headlines } = req.body;
    if (!content || !tags || !title || !headlines) {
      res.status(400);
      throw new Error("All fiels are mandatory");
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
      headlines
    });
    await newContent.save();
    const tagDoc = await Tags.findOne();
    if (!tagDoc) {
      const tagDocs = new Tags({ tags: tags });
      await tagDocs.save();
      return;
    }
    const existingTags = new Set(tagDoc.tags);
    const newUniqueTags = tags.filter((tag) => !existingTags.has(tag));
    if (newUniqueTags.length) {
      tagDoc.tags = [...new Set([...tagDoc.tags, ...newUniqueTags])];
      await tagDoc.save();
    }
    return res.status(200).json({
      status: "success",
      message: "",
      data: newContent
    });
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
    return res.status(200).json({
      status: "success",
      message: "",
      data: allContent
    });
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
    return res.status(200).json({
      status: "success",
      message: "",
      data: content
    });
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
    return res.status(200).json({
      status: "success",
      message: "successfully deleted",
      data: content
    });
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
      ? { tags: { $in: [tags] } }
      : {};
    const content = await Content.find(payload, "content title tags date slug content_id headlines");
    return res.status(200).json({
      status: "success",
      message: "",
      data: content
    });
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
