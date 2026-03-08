const express = require('express');
const router = express.Router();

const { protect, adminOnly } = require('../middleware/auth');
const { uploadArtistImage, uploadArtworkImage } = require('../middleware/upload');
const { getStats } = require('../controllers/adminController');
const {
  listArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist
} = require('../controllers/artistController');
const {
  listArtworks,
  getArtwork,
  createArtwork,
  updateArtwork,
  deleteArtwork
} = require('../controllers/artworkController');
const {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Stats
router.get('/stats', protect, adminOnly, getStats);

// Artists
router.get('/artists', protect, adminOnly, listArtists);
router.post('/artists', protect, adminOnly, uploadArtistImage.single('profileImage'), createArtist);
router.get('/artists/:id', protect, adminOnly, getArtist);
router.put('/artists/:id', protect, adminOnly, uploadArtistImage.single('profileImage'), updateArtist);
router.delete('/artists/:id', protect, adminOnly, deleteArtist);

// Artworks
router.get('/artworks', protect, adminOnly, listArtworks);
router.post('/artworks', protect, adminOnly, uploadArtworkImage.single('image'), createArtwork);
router.get('/artworks/:id', protect, adminOnly, getArtwork);
router.put('/artworks/:id', protect, adminOnly, uploadArtworkImage.single('image'), updateArtwork);
router.delete('/artworks/:id', protect, adminOnly, deleteArtwork);

// Events
router.get('/events', protect, adminOnly, listEvents);
router.post('/events', protect, adminOnly, createEvent);
router.get('/events/:id', protect, adminOnly, getEvent);
router.put('/events/:id', protect, adminOnly, updateEvent);
router.delete('/events/:id', protect, adminOnly, deleteEvent);

module.exports = router;

