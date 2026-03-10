const express = require('express');
const router = express.Router();

const { protect, adminOnly } = require('../middleware/auth');
const { uploadArtworkImage } = require('../middleware/upload');
const { listArtworks, createArtwork, getArtwork } = require('../controllers/artworkController');

// GET /api/artworks - admin list (auto refresh list)
router.get('/', protect, adminOnly, listArtworks);

// GET /api/artworks/:id - admin get
router.get('/:id', protect, adminOnly, getArtwork);

// POST /api/artworks - create artwork (FormData supports image upload)
router.post('/', protect, adminOnly, uploadArtworkImage.single('image'), createArtwork);

module.exports = router;

