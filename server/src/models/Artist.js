const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Artist name is required'], trim: true },
    bio: { type: String, default: '', trim: true },
    profileImageUrl: { type: String, default: '' }, // served from /uploads
    contact: {
      email: { type: String, default: '', trim: true },
      phone: { type: String, default: '', trim: true },
      website: { type: String, default: '', trim: true }
    },
    social: {
      instagram: { type: String, default: '', trim: true },
      twitter: { type: String, default: '', trim: true },
      linkedin: { type: String, default: '', trim: true },
      facebook: { type: String, default: '', trim: true }
    }
  },
  { timestamps: true }
);

artistSchema.index({ name: 'text', bio: 'text' });

module.exports = mongoose.model('Artist', artistSchema);

