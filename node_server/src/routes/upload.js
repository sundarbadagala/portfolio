const multer = require("multer");
const express = require("express");
const { diskStorage } = require('../utils/methods')
const {
  getCloudinarySignature,
  uploadToCloudinary,
  uploadPDF,
} = require("../controllers/upload");

const router = express.Router();
const uploadMemory = multer({ storage: multer.memoryStorage() });
const uploadDisk = multer({ storage: diskStorage })

router.route("/cloudinary/signature").get(getCloudinarySignature);
router
  .route("/cloudinary/upload")
  .post(uploadMemory.single("file"), uploadToCloudinary);

router.route("/pdf").post(uploadDisk.single("file"), uploadPDF);

module.exports = router;
