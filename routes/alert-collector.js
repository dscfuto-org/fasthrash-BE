const express = require('express');
const router = express.Router();
const alertController = require('../controllers/AlertController');
const { verifyUser } = require('../middlewares/verifyUser');
const processFileMiddleware = require('../middlewares/upload');
const { visionAIFilter } = require('../middlewares/vision');

router.get('/', alertController.getAllAlertsByRoleAndStatus);
router.post(
  '/create/',
  verifyUser,
  processFileMiddleware,
  visionAIFilter,
  alertController.createAlert
);
router.put('/update/:id', verifyUser, alertController.updateAlertStatus);
router.put(
  '/user/update/:id',
  verifyUser,
  alertController.updateUserAlertStatus
);
router.get('/:id/', verifyUser, alertController.getAlert);
router.get('/user/:userId/', verifyUser, alertController.getAlertsByUser);
router.get(
  '/collector/:collectorId/',
  verifyUser,
  alertController.getAcceptedAlerts
);
router.delete('/delete/:id/', verifyUser, alertController.deleteAlert);

module.exports = router;
