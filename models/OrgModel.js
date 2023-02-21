const mongoose = require('mongoose');
const validator = require('validator');

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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: { type: String, required: [true, 'Please provide a password'] },
    passwordConfirm: {
      type: String,
      required: [true, 'Password confirm is required'],
      expiresAt: { type: Date, expires: 10 },
    },
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
