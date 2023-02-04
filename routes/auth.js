const express = require('express');
const AuthController = require('../controllers/AuthController');
const { verifyUser } = require('../middlewares/verifyUser');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/org/register', AuthController.registerOrg);
router.post('/org/login', AuthController.loginOrg);
router.delete('/delete/:userID', verifyUser, AuthController.userDelete);
router.delete('/org/delete/:userID', verifyUser, AuthController.orgDelete);
router.post(['/logout', '/org/logout'], AuthController.logout);

module.exports = router;
