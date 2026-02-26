const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Thư mục lưu file
  },
  filename: function (req, file, cb) {
    // Đặt tên file duy nhất
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const upload = multer({ storage: storage });

// API upload
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  // Trả về URL truy cập ảnh
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, url: imageUrl });
});

module.exports = router;