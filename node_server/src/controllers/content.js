const slugify = require("slugify");
const { getNanoId } = require("../utils/methods");

const User = require("../models/user");
const Content = require("../models/content");
const { PostContentDto, SearchContentDto, UpdateContentDto } = require("../dto/content.dto");

/**
 * @desc post content
 * @path POST /api/v1/content
 * @access private
 */
async function postContent(req, res, next) {
  try {
    const dto = new PostContentDto(req.body);
    dto.validate();
    const { content, tags, title, headlines, groupby } = dto;
    const user = await User.findById(req.user.id);
    const nanoidFn = await getNanoId();
    const id = nanoidFn(8).toUpperCase();
    const slug = slugify(title, { lower: true, strict: true });
    const newContent = new Content({
      content_id: id,
      slug,
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
      {},
      "title tags date highlight headlines slug content_id groupby"
    ).sort({ createdAt: -1 });
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
    const { id } = req.params;
    const content = id.length === 8
      ? await Content.findOneAndDelete({ content_id: id })
      : await Content.findByIdAndDelete(id);
    if (!content) {
      res.status(400);
      throw new Error("Content not found");
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
    const dto = new SearchContentDto(req.query);
    dto.validate();
    const content = await Content.find(
      dto.toQuery(),
      "content title tags date slug content_id headlines groupby"
    );
    return res.sendSuccess(content);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc update content by Id
 * @path PUT /api/v1/content/:id
 * @access private
 */
async function updateContent(req, res, next) {
  try {
    const { id } = req.params;
    const contentDoc = id.length === 8
      ? await Content.findOne({ content_id: id })
      : await Content.findById(id);

    if (!contentDoc) {
      res.status(404);
      throw new Error("Content not found");
    }

    const dto = new UpdateContentDto(req.body);
    dto.validate();

    const { content, tags, title, headlines, groupby } = dto;

    if (title !== undefined) {
      contentDoc.title = title;
      contentDoc.slug = slugify(title, { lower: true, strict: true });
    }
    if (content !== undefined) {
      contentDoc.content = content;
    }
    if (headlines !== undefined) {
      contentDoc.headlines = headlines;
    }
    if (groupby !== undefined) {
      contentDoc.groupby = groupby;
    }
    if (tags !== undefined) {
      contentDoc.tags = tags;
    }

    await contentDoc.save();
    return res.sendSuccess(contentDoc, "successfully updated");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postContent,
  getContent,
  getContentById,
  deleteContentById,
  getSeachContent,
  updateContent
};
