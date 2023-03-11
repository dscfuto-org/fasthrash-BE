const express = require('express');
const router = express.Router();
const alertController = require('../controllers/AlertController');
const processFileMiddleware = require('../middlewares/upload');
const { visionAIFilter } = require('../middlewares/vision');

router.get('/', alertController.getAllAlertsByRole);
router.post(
  '/create/',
  processFileMiddleware,
  visionAIFilter,
  alertController.createAlert
);
router.put('/update/:id', alertController.updateAlertStatus);
router.get('/:id/', alertController.getAlert);
router.delete('/delete/:id/', alertController.deleteAlert);

module.exports = router;
