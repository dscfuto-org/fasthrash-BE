const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/org/register', AuthController.registerOrg);
router.post('/org/login', AuthController.loginOrg);
router.delete(['/logout', '/org/logout'], AuthController.logout);

module.exports = router;
