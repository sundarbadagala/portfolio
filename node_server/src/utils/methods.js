const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

//token generator
function tokenGenerator(payload, callback) {
  return jwt.sign(
    payload,
    process.env.JWT_KEY,
    { expiresIn: 36000000 },
    (err, token) => {
      return callback(err, token);
    }
  );
}

//convert text password to encrypted
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
}

// compar db password to user entered password
async function comparePassword(password, userPassword) {
  return await bcrypt.compare(password, userPassword);
}

// send mail to reciepent
async function mailSender(usermail, username) {
  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_APP_PASS) {
      console.warn("mailSender skipped: Email credentials (MAIL_USER, MAIL_APP_PASS) missing in env");
      return null;
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_APP_PASS
      },
      connectionTimeout: 8000, // 8 seconds connection timeout
      greetingTimeout: 8000,   // 8 seconds greeting timeout
      socketTimeout: 8000,     // 8 seconds socket timeout
      dnsTimeout: 5000         // 5 seconds dns timeout
    });
    const mailOptions = {
      from: `"Sundar Blogs" <${process.env.MAIL_USER}>`,
      to: usermail,
      subject: "Sundars Blogs",
      text: `Hi ${username}, how r u?`,
      html: `<h2>Hi ${username},</h2>
      <p>Thank you for reaching out through my portfolio.</p>
      <p>I’ve received your message and will get back to you shortly.</p>
      <p>Looking forward to connecting with you.</p>
      <br/>
      <p>Best regards,<br/>Sundar Rao</p>`
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("mailSender error:", error);
    throw error;
  }
}

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// NANO ID CONFIG
let nanoid;

async function getNanoId() {
  if (!nanoid) {
    const mod = await import("nanoid");
    nanoid = mod.nanoid;
  }
  return nanoid;
}

// MULTER DISK STORAGE
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

module.exports = {
  tokenGenerator,
  hashPassword,
  comparePassword,
  mailSender,
  cloudinary,
  getNanoId,
  diskStorage
};
