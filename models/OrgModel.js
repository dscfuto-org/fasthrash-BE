const mongoose = require('mongoose');
// const pointSchema = require('./PointModel');

let OrgSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    location: { type: String, required: true },
    size: { type: String, enum: ['Small', 'Medium', 'Large'], required: true },
    yearsOfOperation: {
      type: Number,
      required: true,
      min: [0, "Years of operation can't be negative"],
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    histories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'History',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', OrgSchema);
