const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, default: '', trim: true },
    imageUrl: { type: String, default: '' }, // served from /uploads
    price: { type: Number, default: 0, min: 0 },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Painting', 'Sketch', 'Digital Art', 'Sculpture', 'Photography', 'Other'],
      default: 'Other'
    },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    status: {
      type: String,
      enum: ['Sold', 'Unsold'],
      default: 'Unsold'
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

artworkSchema.index({ title: 'text', description: 'text', category: 1 });

module.exports = mongoose.model('Artwork', artworkSchema);

