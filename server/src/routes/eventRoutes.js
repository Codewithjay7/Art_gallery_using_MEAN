const express = require('express');
const router = express.Router();

const { protect, adminOnly } = require('../middleware/auth');
const { listEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

// Required endpoint pattern (admin-only, same as artworks)
// GET /api/events
router.get('/', protect, adminOnly, listEvents);

// POST /api/events
router.post('/', protect, adminOnly, createEvent);

// GET /api/events/:id
router.get('/:id', protect, adminOnly, getEvent);

// PUT /api/events/:id
router.put('/:id', protect, adminOnly, updateEvent);

// DELETE /api/events/:id
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;

