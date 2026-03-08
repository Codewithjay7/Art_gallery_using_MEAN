const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');
const { deleteUploadedByUrl } = require('../utils/imageUpload');
const mongoose = require('mongoose');

// @desc    List artists (search/filter)
// @route   GET /api/admin/artists?search=...
// @access  Admin
exports.listArtists = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) query.$text = { $search: String(search) };

    const artists = await Artist.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: artists.length, artists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get artist
// @route   GET /api/admin/artists/:id
// @access  Admin
exports.getArtist = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || id === 'undefined' || id === 'null' || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid artist id' });
    }
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ success: false, message: 'Artist not found' });
    res.status(200).json({ success: true, artist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Create artist
// @route   POST /api/admin/artists
// @access  Admin
exports.createArtist = async (req, res) => {
  try {
    const { name, bio, contact, social, email, phone } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const artist = await Artist.create({
      name,
      bio: bio || '',
      contact: {
        ...(contact ? (typeof contact === 'string' ? JSON.parse(contact) : contact) : {}),
        email: email || '',
        phone: phone || ''
      },
      social: social || {},
      profileImageUrl
    });

    res.status(201).json({ success: true, artist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update artist
// @route   PUT /api/admin/artists/:id
// @access  Admin
exports.updateArtist = async (req, res) => {
  try {
    const { name, bio, contact, social, email, phone } = req.body;
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ success: false, message: 'Artist not found' });

    if (req.file) {
      deleteUploadedByUrl(artist.profileImageUrl);
      artist.profileImageUrl = `/uploads/${req.file.filename}`;
    }

    if (name !== undefined) artist.name = name;
    if (bio !== undefined) artist.bio = bio;
    if (contact !== undefined) artist.contact = typeof contact === 'string' ? JSON.parse(contact) : contact;
    if (email !== undefined) artist.contact.email = email;
    if (phone !== undefined) artist.contact.phone = phone;
    if (social !== undefined) artist.social = social;

    await artist.save();
    res.status(200).json({ success: true, artist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Delete artist (and their artworks)
// @route   DELETE /api/admin/artists/:id
// @access  Admin
exports.deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ success: false, message: 'Artist not found' });

    // delete artworks + their images
    const artworks = await Artwork.find({ artist: artist._id });
    for (const art of artworks) {
      deleteUploadedByUrl(art.imageUrl);
      await art.deleteOne();
    }

    deleteUploadedByUrl(artist.profileImageUrl);
    await artist.deleteOne();

    res.status(200).json({ success: true, message: 'Artist deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

