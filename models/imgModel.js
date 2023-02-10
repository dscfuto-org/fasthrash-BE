const uuid = require('uuid');
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v4,
  },
  url: String,
  title: String,
});

module.exports = mongoose.model('Image', imageSchema);
