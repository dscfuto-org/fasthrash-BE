const express = require('express');
const router = express.Router();
const alertController = require('../controllers/AlertController');
const multer = require('multer');
const upload = multer();
const { verifyUser } = require('../middlewares/verifyUser');

router.get('/', alertController.getAllAlertsByRole);
router.post('/create/',verifyUser, upload.single('file'), alertController.createAlert);
router.put('/update/:id', verifyUser, alertController.updateAlertStatus);
router.get('/:id/', verifyUser, alertController.getAlert);
router.delete('/delete/:id/', verifyUser, alertController.deleteAlert);
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
