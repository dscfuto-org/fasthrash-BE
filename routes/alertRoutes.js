const express = require('express');
const router = express.Router();
const alertController = require('../controllers/AlertController');

router.post('/', alertController.createAlert);
router.patch('/:id', alertController.getAlert);
router.delete('/:id', alertController.deleteAlert);

module.exports = router;
