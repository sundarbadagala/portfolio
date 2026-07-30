const express = require("express");
const jwtHandler = require("../middleware/jwtHandler");
const {
  getContent,
  postContent,
  getContentById,
  deleteContentById,
  getSeachContent,
  updateContent,
} = require("../controllers/content");

const router = express.Router();

router.route("/").get(getContent).post(jwtHandler, postContent);
router.route("/search").get(getSeachContent);
router.route("/:id").get(getContentById).delete(jwtHandler, deleteContentById).put(jwtHandler, updateContent);

module.exports = router;
