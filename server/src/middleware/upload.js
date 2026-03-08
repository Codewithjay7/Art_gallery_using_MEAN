const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

ensureUploadDir();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '';
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${safeExt}`);
  }
});

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only JPEG, PNG, and WEBP images are allowed'));
  }
  cb(null, true);
}

function makeUploader({ maxBytes }) {
  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxBytes }
  });
}

module.exports = {
  UPLOAD_DIR,
  uploadArtistImage: makeUploader({ maxBytes: 2 * 1024 * 1024 }),
  uploadArtworkImage: makeUploader({ maxBytes: 5 * 1024 * 1024 })
};

