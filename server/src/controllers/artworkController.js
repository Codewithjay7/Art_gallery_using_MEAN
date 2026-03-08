const Artwork = require('../models/Artwork');
const Artist = require('../models/Artist');
const { deleteUploadedByUrl } = require('../utils/imageUpload');
const mongoose = require('mongoose');

// @desc    List artworks (search/filter)
// @route   GET /api/admin/artworks?search=...&category=...&artistId=...
// @access  Admin
exports.listArtworks = async (req, res) => {
  try {
    const { search, category, artistId } = req.query;
    const query = {};
    if (search) query.$text = { $search: String(search) };
    if (category) query.category = String(category);
    if (artistId) query.artist = String(artistId);

    const artworks = await Artwork.find(query)
      .populate('artist', 'name profileImageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: artworks.length, artworks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get artwork
// @route   GET /api/admin/artworks/:id
// @access  Admin
exports.getArtwork = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || id === 'undefined' || id === 'null' || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid artwork id' });
    }
    const artwork = await Artwork.findById(req.params.id).populate('artist', 'name profileImageUrl');
    if (!artwork) return res.status(404).json({ success: false, message: 'Artwork not found' });
    res.status(200).json({ success: true, artwork });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Create artwork
// @route   POST /api/admin/artworks
// @access  Admin
exports.createArtwork = async (req, res) => {
  try {
    const { title, description, price, category, artistId } = req.body;
    if (!title || !category || !artistId) {
      return res.status(400).json({ success: false, message: 'Title, category, and artistId are required' });
    }

    const artist = await Artist.findById(artistId);
    if (!artist) return res.status(400).json({ success: false, message: 'Invalid artistId' });

    // Require image for creation to avoid empty records
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const artwork = await Artwork.create({
      title,
      description: description || '',
      imageUrl,
      price: Number(price || 0),
      category,
      artist: artist._id
    });

    const populated = await Artwork.findById(artwork._id).populate('artist', 'name profileImageUrl');
    res.status(201).json({ success: true, artwork: populated });
  } catch (error) {
    console.error('Create artwork error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update artwork
// @route   PUT /api/admin/artworks/:id
// @access  Admin
exports.updateArtwork = async (req, res) => {
  try {
    const { title, description, price, category, artistId } = req.body;
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ success: false, message: 'Artwork not found' });

    if (artistId) {
      const artist = await Artist.findById(artistId);
      if (!artist) return res.status(400).json({ success: false, message: 'Invalid artistId' });
      artwork.artist = artist._id;
    }

    if (req.file) {
      deleteUploadedByUrl(artwork.imageUrl);
      artwork.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (title !== undefined) artwork.title = title;
    if (description !== undefined) artwork.description = description;
    if (price !== undefined) artwork.price = Number(price);
    if (category !== undefined) artwork.category = category;

    await artwork.save();
    const populated = await Artwork.findById(artwork._id).populate('artist', 'name profileImageUrl');
    res.status(200).json({ success: true, artwork: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Delete artwork
// @route   DELETE /api/admin/artworks/:id
// @access  Admin
exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ success: false, message: 'Artwork not found' });

    deleteUploadedByUrl(artwork.imageUrl);
    await artwork.deleteOne();
    res.status(200).json({ success: true, message: 'Artwork deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

