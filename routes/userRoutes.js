const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createAlert);
router.patch('/:id', userController.getAlert);
router.delete('/:id', userController.getAlert);

module.exports = router;
