const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function safeExtFromMime(mime) {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return null;
}

/**
 * Accepts data URL: "data:image/png;base64,AAAA..."
 * Returns public URL path: "/uploads/<filename>"
 */
function saveImageDataUrl(dataUrl, { maxBytes = 2 * 1024 * 1024 } = {}) {
  if (!dataUrl) return { ok: true, url: '' };
  if (typeof dataUrl !== 'string') return { ok: false, message: 'Invalid image payload' };

  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
  if (!match) return { ok: false, message: 'Image must be a base64 data URL' };

  const mime = match[1].toLowerCase();
  const base64 = match[2];
  const ext = safeExtFromMime(mime);
  if (!ext) return { ok: false, message: 'Only JPEG, PNG, and WEBP images are allowed' };

  let buffer;
  try {
    buffer = Buffer.from(base64, 'base64');
  } catch {
    return { ok: false, message: 'Invalid base64 image data' };
  }

  if (!buffer?.length) return { ok: false, message: 'Empty image data' };
  if (buffer.length > maxBytes) return { ok: false, message: `Image too large (max ${Math.floor(maxBytes / 1024 / 1024)}MB)` };

  ensureUploadDir();
  const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
  const abs = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(abs, buffer);
  return { ok: true, url: `/uploads/${filename}` };
}

function deleteUploadedByUrl(url) {
  if (!url || typeof url !== 'string') return;
  if (!url.startsWith('/uploads/')) return;
  const filename = url.replace('/uploads/', '');
  const abs = path.join(UPLOAD_DIR, filename);
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
}

module.exports = {
  saveImageDataUrl,
  deleteUploadedByUrl,
  UPLOAD_DIR
};

