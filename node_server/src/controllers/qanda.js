const QandA = require("../models/qanda");
const { getNanoId } = require("../utils/methods");
const { PostQandADto, UpdateQandADto } = require("../dto/qanda.dto");

/**
 * @desc post Q&A
 * @path POST /api/v1/qanda
 * @access private (protected)
 */
async function postQandA(req, res, next) {
  try {
    const dto = new PostQandADto(req.body);
    dto.validate();

    const { question, answer, category, sub_category, level } = dto;

    const nanoidFn = await getNanoId();
    const id = nanoidFn(8).toUpperCase();

    const newQandA = new QandA({
      question_id: id,
      question,
      answer,
      category,
      sub_category,
      level
    });

    await newQandA.save();
    return res.sendSuccess(newQandA, "Q&A created successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * @desc get all Q&As
 * @path GET /api/v1/qanda
 * @access private (protected)
 */
async function getQandA(req, res, next) {
  try {
    const allQandAs = await QandA.find({}).sort({ createdAt: -1 });
    if (!allQandAs) {
      res.status(404);
      throw new Error("No Q&As found");
    }
    return res.sendSuccess(allQandAs);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc get Q&A by ID
 * @path GET /api/v1/qanda/:id
 * @access private (protected)
 */
async function getQandAById(req, res, next) {
  try {
    const { id } = req.params;
    const qanda = id.length === 8
      ? await QandA.findOne({ question_id: id })
      : await QandA.findById(id);

    if (!qanda) {
      res.status(404);
      throw new Error("Q&A not found");
    }
    return res.sendSuccess(qanda);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc update Q&A by ID
 * @path PUT /api/v1/qanda/:id
 * @access private (protected)
 */
async function updateQandA(req, res, next) {
  try {
    const { id } = req.params;
    const qandaDoc = id.length === 8
      ? await QandA.findOne({ question_id: id })
      : await QandA.findById(id);

    if (!qandaDoc) {
      res.status(404);
      throw new Error("Q&A not found");
    }

    const dto = new UpdateQandADto(req.body);
    dto.validate();

    const { question, answer, category, sub_category, level } = dto;

    if (question !== undefined) {
      qandaDoc.question = question;
    }
    if (answer !== undefined) {
      qandaDoc.answer = answer;
    }
    if (category !== undefined) {
      qandaDoc.category = category;
    }
    if (sub_category !== undefined) {
      qandaDoc.sub_category = sub_category;
    }
    if (level !== undefined) {
      qandaDoc.level = level;
    }

    await qandaDoc.save();
    return res.sendSuccess(qandaDoc, "Q&A updated successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * @desc delete Q&A by ID
 * @path DELETE /api/v1/qanda/:id
 * @access private (protected)
 */
async function deleteQandA(req, res, next) {
  try {
    const { id } = req.params;
    const qandaDoc = id.length === 8
      ? await QandA.findOneAndDelete({ question_id: id })
      : await QandA.findByIdAndDelete(id);

    if (!qandaDoc) {
      res.status(404);
      throw new Error("Q&A not found");
    }

    return res.sendSuccess(null, "Q&A deleted successfully");
  } catch (error) {
    next(error);
  }
}
/**
 * @desc get all Q&A categories
 * @path GET /api/v1/qanda/categories
 * @access public
 */
async function getQandACategories(req, res, next) {
  try {
    const categories = await QandA.distinct("category", { category: { $exists: true, $ne: null } });
    return res.sendSuccess(categories);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc get Q&A subcategories by category
 * @path GET /api/v1/qanda/subcategories
 * @access public
 */
async function getQandASubCategories(req, res, next) {
  try {
    const { category } = req.query;
    let filter = { sub_category: { $exists: true, $ne: null } };
    if (category) {
      filter.category = new RegExp(`^${category}$`, "i");
    }
    const subCategories = await QandA.distinct("sub_category", filter);
    console.log('----', subCategories)
    return res.sendSuccess(subCategories);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc get Q&As by subcategory
 * @path GET /api/v1/qanda/by-subcategory
 * @access public
 */
async function getQandABySubCategory(req, res, next) {
  try {
    const { sub_category, subCategory } = req.query;
    const finalSubCategory = sub_category !== undefined ? sub_category : subCategory;

    if (!finalSubCategory) {
      res.status(400);
      throw new Error("Subcategory query parameter is required");
    }

    const qandas = await QandA.find({
      sub_category: new RegExp(`^${finalSubCategory}$`, "i")
    }).sort({ createdAt: -1 });

    return res.sendSuccess(qandas);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postQandA,
  getQandA,
  getQandAById,
  updateQandA,
  deleteQandA,
  getQandACategories,
  getQandASubCategories,
  getQandABySubCategory
};
