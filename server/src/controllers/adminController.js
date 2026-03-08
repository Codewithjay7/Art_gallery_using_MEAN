const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');
const User = require('../models/User');
const Event = require('../models/Event');

// @desc    Dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res) => {
  try {
    const [totalArtists, totalArtworks, totalUsers, totalEvents, salesAgg, categories, recentArtworks, recentArtists] =
      await Promise.all([
        Artist.countDocuments(),
        Artwork.countDocuments(),
        User.countDocuments(),
        Event.countDocuments(),
        Artwork.aggregate([
          { $match: { status: 'Sold' } },
          { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$price' } } }
        ]),
        Artwork.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        Artwork.find().populate('artist', 'name').sort({ createdAt: -1 }).limit(5),
        Artist.find().sort({ createdAt: -1 }).limit(5)
      ]);

    const soldArtworks = salesAgg[0]?.count || 0;
    const totalRevenue = salesAgg[0]?.revenue || 0;
    const unsoldArtworks = totalArtworks - soldArtworks;

    res.status(200).json({
      success: true,
      stats: {
        totalArtists,
        totalArtworks,
        totalUsers,
        totalEvents,
        soldArtworks,
        unsoldArtworks,
        totalRevenue,
        categories: categories.map((c) => ({ category: c._id, count: c.count })),
        recentArtworks,
        recentArtists
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

