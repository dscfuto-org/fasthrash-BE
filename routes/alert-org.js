const express = require('express');
const router = express.Router();
const alertController = require('../controllers/AlertController');
const multer = require('multer');
const upload = multer();

router.get('/', alertController.fetchAlerts);
router.post('/create/', upload.single('file'), alertController.createAlert);
router.put('/update/:id', alertController.updateAlertStatus);
router.get('/:id/', alertController.getAlert);
router.delete('/delete/:id/', alertController.deleteAlert);

module.exports = router;
