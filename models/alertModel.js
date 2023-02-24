const mongoose = require('mongoose');

let alertSchema = new mongoose.Schema(
  {
    description: {
      trim: true,
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'collected'],
      default: 'pending',
    },
    image: { type: String, required: true },
    location: { type: String, required: true },
    quantity: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
