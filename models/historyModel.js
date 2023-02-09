const mongoose = require("mongoose");

let historySchema = new mongoose.Schema(
  {
    recyclerId: {
      type: String,
      required: true,
    },
    // wasteId: {
    //   type: String,
    //   required: true,
    // },
    wasteImageUrl: { type: String },
    wasteImageTitle: { type: String },
    collectionStatus: {
      type: String,
      default: "false",
      enum: ["true", "pending", "false"],
    },
    timeDisposed: { type: Date, required: true },
    timeCollected: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);
