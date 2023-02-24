const mongoose = require('mongoose');

let collectionHistorySchema = new mongoose.Schema(
  {
    collectorId: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    wasteImageUrl: { type: String },
    wasteImageTitle: { type: String },
    timeCollected: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CollectionHistory', collectionHistorySchema);
