const { cloudinary } = require("../utils/methods");

/**
 * @desc get cloudinary signature
 * @path GET /api/v1/upload/cloudinary/signature
 * @access public
 */
async function getCloudinarySignature(req, res, next) {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: process.env.CLOUDINARY_BLOGS_FOLDER },
      process.env.CLOUDINARY_API_SECRET
    );
    return res.sendSuccess({ timestamp, signature, folder: process.env.CLOUDINARY_BLOGS_FOLDER });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc post asset to cloudinary
 * @path GET /api/v1/upload/cloudinary/upload
 * @access public
 */
async function uploadToCloudinary(req, res, next) {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded");
    }
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: process.env.CLOUDINARY_BLOGS_FOLDER },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    return res.sendSuccess({ url: result.secure_url });
  } catch (error) {
    next(error);
  }
}
// FRONTEND SIDE EXAMPLE CODE
//   const file = e.target.files?.[0];
//   if (!file) return;
//   const formData = new FormData();
//   formData.append("file", file);
//   const res = await  axios.post('http://localhost:8080/api/v1/upload/cloudinary/upload', formData, {
//     headers: { "Content-Type": "multipart/form-data" }
//   });

/**
 * @desc upload PDF
 * @path GET /api/v1/upload/pdf
 * @access public
 */

async function uploadPDF(req, res, next) {
  res.json('upload success')
}


module.exports = { getCloudinarySignature, uploadToCloudinary, uploadPDF };
