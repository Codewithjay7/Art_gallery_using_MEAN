const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');

// @desc    Dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res) => {
  try {
    const [totalArtists, totalArtworks] = await Promise.all([
      Artist.countDocuments(),
      Artwork.countDocuments()
    ]);

    const categories = await Artwork.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentUploads = await Artwork.find()
      .populate('artist', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalArtists,
        totalArtworks,
        categories: categories.map(c => ({ category: c._id, count: c.count })),
        recentUploads
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

