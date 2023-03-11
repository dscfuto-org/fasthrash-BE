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

module.exports = router;
