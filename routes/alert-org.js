const express = require('express');
const router = express.Router();
const alertController = require('../controllers/AlertController');
const multer = require('multer');
const upload = multer();
const { verifyOrg } = require('../middlewares/verifyUser');

router.get('/', alertController.getAllAlertsByRole);
router.post('/create/',verifyOrg, upload.single('file'), alertController.createAlert);
router.put('/update/:id', verifyOrg, alertController.updateAlertStatus);
router.get('/:id/', verifyOrg, alertController.getAlert);
router.delete('/delete/:id/', verifyOrg, alertController.deleteAlert);

module.exports = router;
