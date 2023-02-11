const UserModel = require('../models/UserModel');
const OrgModel = require('../models/OrgModel');
// const { body, validationResult } = require('express-validator');
// const { sanitizeBody } = require('express-validator');
//helper file to prepare responses.
// const apiResponse = require('../helpers/apiResponse');
// const utility = require('../helpers/utility');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { fn } = require('moment/moment');
// const mailer = require("../helpers/mailer");
// const { constants } = require('../helpers/constants');

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      location
 * @param {string}      email
 * @param {string}		  phoneNumber
 * @param {string}      password
 *
 * @returns {Object}
 */

exports.register = async (req, res) => {
  await UserModel.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length >= 1) {
        return res.status(409).json({
          message: 'Email is already taken!',
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new UserModel({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              location: req.body.location,
              email: req.body.email,
              phoneNumber: req.body.phoneNumber,
              password: hash,
              role: req.body.role,
            });

            user
              .save()
              .then((result) => res.status(201).json({ message: result }))
              .catch((err) => res.status(500).json({ error: err }));
          }
        });
      }
    });
};

/**
 * Organization registration.
 *
 * @param {string}      businessName
 * @param {string}      location
 * @param {string}      size
 * @param {Number}		  yearsOfOperation
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */

exports.registerOrg = async (req, res) => {
  await OrgModel.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length >= 1) {
        return res.status(409).json({
          message: 'Email is already taken!',
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const organization = new OrgModel({
              businessName: req.body.businessName,
              location: req.body.location,
              size: req.body.size,
              yearsOfOperation: req.body.yearsOfOperation,
              email: req.body.email,
              password: hash,
            });

            organization
              .save()
              .then((result) => res.status(201).json({ message: result }))
              .catch((err) => res.status(500).json({ error: err }));
          }
        });
      }
    });
};

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */

exports.login = async (req, res) => {
  await UserModel.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length == 0) {
        return res.sendStatus(404).json({ message: 'Email does not exist' });
      }
      bcrypt.compare(req.body.password, users[0].password, (err, same) => {
        if (err) {
          res.sendStatus(401);
        }
        if (same) {
          // create a token
          const token = jwt.sign(
            {
              email: users[0].email,
              userID: users[0]._id,
            },
            users[0].role === 'user'
              ? process.env.JWT_SECRET_USER
              : process.env.JWT_SECRET_COLLECTOR,
            {
              expiresIn: process.env.JWT_TIMEOUT_DURATION,
            }
          );
          return res.status(200).json({
            message: 'Authorization successful',
            id: users[0]._id,
            token: token,
          });
        }
        res.sendStatus(401);
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err,
      });
    });
};

/**
 * Organization login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */

exports.loginOrg = async (req, res) => {
  await OrgModel.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length == 0) {
        return res.sendStatus(404).json({ message: 'Email does not exist' });
      }
      bcrypt.compare(req.body.password, users[0].password, (err, same) => {
        if (err) {
          res.sendStatus(401);
        }
        if (same) {
          // create a token
          const token = jwt.sign(
            {
              email: users[0].email,
              userID: users[0]._id,
            },
            process.env.JWT_SECRET_ORGANIZATION,
            {
              expiresIn: process.env.JWT_TIMEOUT_DURATION,
            }
          );
          return res.status(200).json({
            message: 'Authorization successful',
            id: users[0]._id,
            token: token,
          });
        }
        res.sendStatus(401);
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err,
      });
    });
};

exports.userDelete = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.params.userID });
  await UserModel.deleteOne({ _id: req.params.userID })
    .exec()
    // eslint-disable-next-line no-unused-vars
    .then((response) =>
      res.status(200).json({
        message: `${
          user.role.charAt(0).toUpperCase() + user.role.slice(1)
        } deleted successfully!`,
      })
    )
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.orgDelete = async (req, res) => {
  await OrgModel.deleteOne({ _id: req.params.userID })
    .exec()
    // eslint-disable-next-line no-unused-vars
    .then((response) =>
      res.status(200).json({ message: 'Organization deleted successfully!' })
    )
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.logout = [
  (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          res.status(400).send('Unable to log out');
        } else {
          res.send('Logout successful');
        }
      });
    } else {
      res.end();
    }
  },
];

exports.resetPassword =[
  async (req, res) => {
    try {
      const { email, password, token } = req.body;
  
      // Verify that the token is valid
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Find the user with the email
      const user = await User.findOne({ email });
  
      // If the user does not exist, return an error
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      // Check if the token has expired
      if (decoded.exp < Date.now() / 1000) {
        return res.status(400).json({ error: 'Token has expired' });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      // Return a success message
      res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
];