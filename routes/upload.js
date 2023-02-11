const express = require('express');
const router = express.Router();
const imageUploadController = require('../controllers/ImageUploadController');
require('dotenv').config();

router.post('/upload', imageUploadController.upload);
router.get('/process.env.FETCH_FILES', imageUploadController.getFiles); // for dev purposes
router.get('/file/download/:name', imageUploadController.download);

module.exports = router;
