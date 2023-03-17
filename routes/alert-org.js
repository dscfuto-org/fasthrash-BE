const express = require('express');
const router = express.Router();
const alertController = require('../controllers/AlertController');
const { verifyOrg, verifyUser } = require('../middlewares/verifyUser');
const processFileMiddleware = require('../middlewares/upload');
const { visionAIFilter } = require('../middlewares/vision');

router.get('/', alertController.getAllAlertsByRole);
router.post(
  '/create/',
  verifyOrg,
  processFileMiddleware,
  visionAIFilter,
  alertController.createAlert
);
router.put('/update/:id', verifyOrg, alertController.updateAlertStatus);
router.put(
  '/collector/update/:id',
  verifyUser,
  alertController.updateUserAlertStatus
);
router.get('/:id/', verifyOrg, alertController.getAlert);
router.get('/user/:userId/', verifyOrg, alertController.getAlertsByUser);
router.get(
  '/collector/:collectorId/',
  verifyOrg,
  alertController.getAcceptedAlerts
);
router.delete('/delete/:id/', verifyOrg, alertController.deleteAlert);

module.exports = router;
