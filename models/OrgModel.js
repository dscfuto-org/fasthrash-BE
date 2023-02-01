const mongoose = require('mongoose');

let OrgSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    location: { type: String, required: true },
    size: { type: String, required: true },
    yearsOfOperation: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', OrgSchema);
