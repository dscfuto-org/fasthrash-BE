const mongoose = require('mongoose');

let depositHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    collectorId: {
      type: String,
    },
    alertId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true
    },
    collectionStatus: {
      type: String,
      default: 'pending',
      enum: ['accepted', 'pending', 'collected'],
    },
    timeCollected: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DepositHistory', depositHistorySchema);
