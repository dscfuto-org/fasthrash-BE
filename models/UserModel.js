const mongoose = require('mongoose');
// const pointSchema = require('./PointModel');

let UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'collector'], default: 'user' },
    histories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'History',
      },
    ],
  },
  { timestamps: true }
);

// Virtual for user's full name
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', UserSchema);
