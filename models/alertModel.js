const mongoose = require('mongoose');

let alertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: {
      trim: true,
      type: String,
    },
    image: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
