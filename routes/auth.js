const express = require('express');
const AuthController = require('../controllers/AuthController');
const { verifyUser, verifyOrg } = require('../middlewares/verifyUser');

const router = express.Router();

// user/collector auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/resetpassword/', AuthController.requestPasswordReset);
router.post(
  '/resetpassword/:userID/:token/:tokenID',
  AuthController.resetPassword
);
router.patch('/update/:id', verifyUser, AuthController.updateUserData);
router.delete('/delete/:userID', verifyUser, AuthController.userDelete);
router.get('/profile/:userID', AuthController.profile);

// organization auth routes
router.post('/org/register', AuthController.registerOrg);
router.post('/org/login', AuthController.loginOrg);
router.post('/org/resetpassword/', AuthController.requestPasswordResetOrg);
router.post(
  '/org/resetpassword/:userID/:token/:tokenID',
  AuthController.resetPasswordOrg
);
router.patch('/org/update/:id', verifyOrg, AuthController.updateOrgData);
router.delete('/org/delete/:userID', verifyOrg, AuthController.orgDelete);
router.get('/org/profile/:userID', verifyOrg, AuthController.orgProfile);

module.exports = router;
