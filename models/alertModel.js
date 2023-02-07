const mongoose = require('mongoose');

let alertSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: {
      trim: true,
      type: String,
    },
    image: { type: String, required: true },
    location: { type: String, required: true },
    quantity: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
