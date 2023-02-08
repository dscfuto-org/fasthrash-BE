const uuid = require('uuid');

const imageSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: uuid.v4
    },
    url: String,
    title: String
  });

const Image = mongoose.model('Image', imageSchema);
