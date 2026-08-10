const express = require("express");
const jwtHandler = require("../middleware/jwtHandler");
const {
  postQandA,
  getQandA,
  getQandAById,
  updateQandA,
  deleteQandA,
  getQandACategories,
  getQandASubCategories,
  getQandABySubCategory
} = require("../controllers/qanda");

const router = express.Router();

router.route("/")
  .get(getQandA)
  .post(jwtHandler, postQandA);

router.route("/categories")
  .get(getQandACategories);

router.route("/subcategories")
  .get(getQandASubCategories);

router.route("/by-subcategory")
  .get(getQandABySubCategory);

router.route("/:id")
  .get(getQandAById)
  .put(jwtHandler, updateQandA)
  .delete(jwtHandler, deleteQandA);

module.exports = router;
