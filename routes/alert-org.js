const express = require('express');
const router = express.Router();
const alertController = require('../controllers/AlertController');

router.post('/create/', alertController.createAlert);
router.get('/:id/', alertController.getAlert);
router.delete('/delete/:id/', alertController.deleteAlert);

module.exports = router;
