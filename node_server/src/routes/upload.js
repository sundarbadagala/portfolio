const multer = require("multer");
const express = require("express");
const {
  getCloudinarySignature,
  uploadToCloudinary
} = require("../controllers/upload");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route("/cloudinary/signature").get(getCloudinarySignature);
router
  .route("/cloudinary/upload")
  .post(upload.single("file"), uploadToCloudinary);

module.exports = router;
