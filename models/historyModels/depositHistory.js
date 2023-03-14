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
    wasteImageUrl: { type: String },
    wasteImageDescription: { type: String },
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
