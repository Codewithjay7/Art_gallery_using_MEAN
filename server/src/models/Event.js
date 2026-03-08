const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, default: '', trim: true },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, required: [true, 'End date is required'] },
    participatingArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);

