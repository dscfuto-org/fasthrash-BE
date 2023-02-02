const express = require('express');
const { route } = require('./auth');
const router = express.Router();
const userController = require('../controllers/userController')
const app = express();

router.route('/alert').post(userController.createAlert)
router.route('/alert/:id').patch(userController.getAlert).delete(userController.deleteAlert)
