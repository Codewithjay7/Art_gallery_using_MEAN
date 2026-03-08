const express = require('express');
const router = express.Router();

const {
  listArtists,
  getArtist
} = require('../controllers/artistController');
const {
  listArtworks,
  getArtwork
} = require('../controllers/artworkController');

// Public routes - no authentication required
router.get('/artists', listArtists);
router.get('/artists/:id', getArtist);
router.get('/artworks', listArtworks);
router.get('/artworks/:id', getArtwork);

module.exports = router;
