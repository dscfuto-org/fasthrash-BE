const util = require('util');
const Multer = require('multer');
const maxSize = 10 * 1024 * 1024;
const path = require('path');

let processFile = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
}).single('file');

let processFileMiddleware = util.promisify(processFile);
module.exports = processFileMiddleware;
