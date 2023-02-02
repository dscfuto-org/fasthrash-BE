const mongoose = require('mongoose');

let alertSchema = new mongoose.Schema(
  {
    title: String,
    description: {
      trim: true,
      type: String,
    },
    image: String,
    location: { type: { type: String }, coordinates: [Number] },
  },
  { timestamps: true }
);

alertSchema.index({ loc: '2dsphere' });
const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;
