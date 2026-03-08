const Event = require('../models/Event');
const Artist = require('../models/Artist');

// @desc    List events
// @route   GET /api/admin/events
// @access  Admin
exports.listEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('participatingArtists', 'name')
      .sort({ startDate: 1 });
    res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get single event
// @route   GET /api/admin/events/:id
// @access  Admin
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('participatingArtists', 'name');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Create event
// @route   POST /api/admin/events
// @access  Admin
exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, startDate, endDate, participatingArtists } = req.body;

    if (!title || !location || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Title, location, start date and end date are required' });
    }

    let artistIds = [];
    if (participatingArtists) {
      // may come as JSON string from form-data
      const raw = typeof participatingArtists === 'string' ? JSON.parse(participatingArtists) : participatingArtists;
      artistIds = Array.isArray(raw) ? raw : [];
    }

    const event = await Event.create({
      title,
      description: description || '',
      location,
      startDate,
      endDate,
      participatingArtists: artistIds
    });

    const populated = await Event.findById(event._id).populate('participatingArtists', 'name');
    res.status(201).json({ success: true, event: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Admin
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, location, startDate, endDate, participatingArtists } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (location !== undefined) event.location = location;
    if (startDate !== undefined) event.startDate = startDate;
    if (endDate !== undefined) event.endDate = endDate;

    if (participatingArtists !== undefined) {
      const raw = typeof participatingArtists === 'string' ? JSON.parse(participatingArtists) : participatingArtists;
      event.participatingArtists = Array.isArray(raw) ? raw : [];
    }

    await event.save();
    const populated = await Event.findById(event._id).populate('participatingArtists', 'name');
    res.status(200).json({ success: true, event: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Admin
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    await event.deleteOne();
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

