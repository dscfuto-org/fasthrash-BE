const mongoose = require('mongoose');
const validator = require('validator');

let UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    location: { type: String, required: true },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: [true, 'Please provide a password'] },
    passwordConfirm: {
      type: String,
      required: [true, 'Password confirm is required'],
    },
    profileImage: {
      type: String,
      default:
        'https://media.istockphoto.com/id/522855255/vector/male-profile-flat-blue-simple-icon-with-long-shadow.jpg?s=612x612&w=0&k=20&c=EQa9pV1fZEGfGCW_aEK5X_Gyob8YuRcOYCYZeuBzztM=',
    },
    role: { type: String, enum: ['user', 'collector'], required: true },
    depositHistories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DepositHistory',
      },
    ],
    collectionHistories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollectionHistory',
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
