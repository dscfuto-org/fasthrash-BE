const express = require('express');
const router = express.Router();
const imageUploadController = require('../controllers/ImageUploadController');
require('dotenv').config();
const { verifyUser } = require('../middlewares/verifyUser');

router.post('/upload', imageUploadController.upload);
router.get(process.env.FETCH_FILES, imageUploadController.getFiles); // for dev purposes
router.get('/file/download/:name', verifyUser, imageUploadController.download);

module.exports = router;
