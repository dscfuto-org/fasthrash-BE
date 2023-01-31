const UserModel = require('../models/UserModel');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
//helper file to prepare responses.
const apiResponse = require('../helpers/apiResponse');
// const utility = require('../helpers/utility');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const mailer = require("../helpers/mailer");
// const { constants } = require('../helpers/constants');

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}		phoneNumber
 * @param {string}      password
 *
 * @returns {Object}
 */

exports.register = [
  // Validate fields.
  body('firstName')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('lastName')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Last name must be specified.')
    .isAlphanumeric()
    .withMessage('Last name has non-alphanumeric characters.'),
  body('email')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Email must be specified.')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .custom((value) => {
      return UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
  body('phoneNumber')
    .isLength({ min: 11 })
    .withMessage('Phone number must be specified')
    .custom((value) => {
      return UserModel.findOne({ phoneNumber: value }).then((user) => {
        if (user) {
          return Promise.reject('Phone number already in use');
        }
      });
    }),
  body('password')
    .isLength({ min: 8 })
    .trim()
    .withMessage('Password must be 8 characters or greater.'),

  // Sanitize fields.
  sanitizeBody('firstName').escape(),
  sanitizeBody('lastName').escape(),
  sanitizeBody('email').escape(),
  sanitizeBody('phoneNumber').escape(),
  sanitizeBody('password').escape(),

  // Process request after validation and sanitization.
  (req, res) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          'Validation Error.',
          errors.array()
        );
      }
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
  body('email')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Email must be specified.')
    .isEmail()
    .withMessage('Email must be a valid email address.'),
  body('password')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Password must be specified.'),
  sanitizeBody('email').escape(),
  sanitizeBody('password').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          'Validation Error.',
          errors.array()
        );
      } else {
        UserModel.findOne({ email: req.body.email }).then((user) => {
          if (user) {
            //Compare given password with db's hash.
            bcrypt.compare(
              req.body.password,
              user.password,
              function (err, same) {
                if (same) {
                  //Check account confirmation.
                  if (user.isConfirmed) {
                    // Check User's account active or not.
                    if (user.status) {
                      let userData = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                      };
                      //Prepare JWT token for authentication
                      const jwtPayload = userData;
                      const jwtData = {
                        expiresIn: process.env.JWT_TIMEOUT_DURATION,
                      };
                      const secret = process.env.JWT_SECRET;
                      //Generated JWT token with Payload and secret.
                      userData.token = jwt.sign(jwtPayload, secret, jwtData);
                      return apiResponse.successResponseWithData(
                        res,
                        'Login Success.',
                        userData
                      );
                    } else {
                      return apiResponse.unauthorizedResponse(
                        res,
                        'Account is not active. Please contact admin.'
                      );
                    }
                  } else {
                    return apiResponse.unauthorizedResponse(
                      res,
                      'Account is not confirmed. Please confirm your account.'
                    );
                  }
                } else {
                  return apiResponse.unauthorizedResponse(
                    res,
                    'Email or Password wrong.'
                  );
                }
              }
            );
          } else {
            return apiResponse.unauthorizedResponse(
              res,
              'Email or Password wrong.'
            );
          }
        });
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
