const express = require('express');
const router = express.Router();
const alertController = require('../controllers/AlertController');

router.post('/create', alertController.createAlert);
router.get('/getalert/:id', alertController.getAlert);
router.get('/getalerts', alertController.getAlerts);
router.delete('/delete/:id', alertController.deleteAlert);
router.patch('/update/:id', alertController.updateAlert);

module.exports = router;
