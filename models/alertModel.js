const mongoose = require('mongoose');

let alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    costPerKg: { type: Number },
    deliveryTime: { type: Number },
    description: {
      trim: true,
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'collected'],
      default: 'pending',
    },
    images: [{ type: String, required: true }],
    address: { type: String },
    location: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
    role: { type: String, enum: ['user', 'collector'], required: true },
    quantity: { type: Number },
    userName: { type: String },
    userEmail: { type: String },
    userPhone: { type: String },
    collectorName: { type: String },
    collectorEmail: { type: String },
    collectorPhone: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
