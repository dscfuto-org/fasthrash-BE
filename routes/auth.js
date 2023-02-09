const express = require('express');
const AuthController = require('../controllers/AuthController');
const {
  verifyUser,
  verifyCollector,
  verifyOrg,
} = require('../middlewares/verifyUser');
const userModel = require('../models/UserModel');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/org/register', AuthController.registerOrg);
router.post('/org/login', AuthController.loginOrg);
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
router.delete('/org/delete/:userID', verifyOrg, AuthController.orgDelete);
router.post(['/logout', '/org/logout'], AuthController.logout);
router.post('reset-password', AuthController.resetPassword);

module.exports = router;
