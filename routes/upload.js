const express = require('express');
const router = express.Router();
const imageUploadController = require('../controllers/ImageUploadController');

router.post('/upload', imageUploadController.upload);
router.get('/files', imageUploadController.getFiles);
router.get('/file/download/:name', imageUploadController.download);

module.exports = router;
