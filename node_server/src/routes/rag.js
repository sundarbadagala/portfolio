const express = require('express')
const multer = require('multer')
const { ragUploadPDF, ragAsk } = require('../controllers/rag')
const router = express.Router()

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        cb(null, file.mimetype === 'application/pdf');
    }
});

router.route('/upload').post(upload.single('file'), ragUploadPDF)
router.route('/ask').post(ragAsk)



module.exports = router 