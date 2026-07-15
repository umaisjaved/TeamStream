const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// =========================
// Auth Middleware
// =========================
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
}

// =========================
// Multer Storage
// =========================
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },

  filename(req, file, cb) {
    const filename =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, filename);
  }
});

// =========================
// File Filter
// =========================
const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'));
  }

};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});


// ============================================
// Upload File (Chat Attachments)
// ============================================
router.post('/', authMiddleware, upload.single('file'), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      message: 'No file uploaded'
    });
  }

  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;

  res.json({
    url: fileUrl,
    filename: req.file.originalname,
    isImage: req.file.mimetype.startsWith('image/'),
    size: req.file.size
  });

});


// ============================================
// Upload Profile Picture
// ============================================
router.post('/avatar', authMiddleware, upload.single('file'), async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: 'No image uploaded'
      });
    }

    const avatarUrl = `http://localhost:3000/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: avatarUrl
      },
      {
        new: true
      }
    );

    res.json({
      message: 'Profile picture updated successfully',
      avatar: avatarUrl,
      user
    });

  }
  catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message
    });

  }

});

module.exports = router;