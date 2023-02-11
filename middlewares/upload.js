const util = require('util');
const Multer = require('multer');
const path = require('path');
const maxSize = 10 * 1024 * 1024;

let processFile = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return cb(new Error('Invalid file type. Only jpg, jpeg, and png files are allowed.'));
    }
    cb(null, true);
  },
}).array('files', 12);

let processFileMiddleware = util.promisify(processFile);
module.exports = processFileMiddleware;
