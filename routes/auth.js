const express = require('express');
const AuthController = require('../controllers/AuthController');
const {
  verifyUser,
  verifyCollector,
  verifyOrg,
} = require('../middlewares/verifyUser');
const userModel = require('../models/UserModel');

const router = express.Router();

// user/collector auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/resetpassword/', AuthController.requestPasswordReset);
router.post(
  '/resetpassword/:userID/:token/:tokenID',
  AuthController.resetPassword
);
router.patch('/update/:id', AuthController.updateUserData);
router.delete(
  '/delete/:userID',
  async (req, res, next) => {
    const user = await userModel.findById(req.params.userID);
    if (user.role === 'user') {
      return verifyUser(req, res, next);
    } else if (user.role === 'collector') {
      return verifyCollector(req, res, next);
    }
  },
  AuthController.userDelete
);
router.get('/profile/:userID', AuthController.profile)

// organization auth routes
router.post('/org/register', AuthController.registerOrg);
router.post('/org/login', AuthController.loginOrg);
// router.post(['/logout', '/org/logout'], AuthController.logout);
router.post('/org/resetpassword/', AuthController.requestPasswordResetOrg);
router.post(
  '/org/resetpassword/:userID/:token/:tokenID',
  AuthController.resetPassword
);
router.patch('/org/update/:id', AuthController.updateOrgData);
router.delete('/org/delete/:userID', verifyOrg, AuthController.orgDelete);
router.get('/org/profile/:userID', AuthController.orgProfile)


module.exports = router;
