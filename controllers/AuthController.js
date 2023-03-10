const UserModel = require('../models/UserModel');
const OrgModel = require('../models/OrgModel');
const TokenModel = require('../models/tokenModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../helpers/mailer');

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
  try {
    await UserModel.find({ email: req.body.email })
      .exec()
      .then((users) => {
        if (users.length >= 1) {
          return res.status(409).json({
            message: 'Email is already taken!',
          });
        } else {
          if (req.body.password !== req.body.passwordConfirm) {
            return res.status(400).json({
              message: 'Password does not match!',
            });
          }
          bcrypt.hash(req.body.password, 12, (err, hash) => {
            if (err) {
              return res.status(400).json({
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
                passwordConfirm: hash,
                role: req.body.role,
              });

              user.passwordConfirm = 'True';
              user
                .save()
                .then((result) => {
                  return res.status(201).json({ message: result });
                })
                .catch((err) => {
                  return res
                    .status(400)
                    .json({ message: 'An error occurred!', error: err });
                });
            }
          });
        }
      });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Error creating an account', error: err });
  }
};

exports.updateUserData = async (req, res) => {
  try {
    const userDataToUpdate = req.body;
    if (req.body.password) {
      return res.status(400).json({
        message: 'This route is not for password reset!',
      });
    }
    if (req.body.email) {
      return res.status(400).json({
        message: `Sorry, you can't update your email at the moment!`,
      });
    }
    if (req.body.role) {
      return res
        .status(400)
        .json({ message: `Sorry, you can't update your role at the moment!` });
    }
    const updatedUserData = await UserModel.findByIdAndUpdate(
      req.params.id,
      userDataToUpdate,
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      message: `${
        updatedUserData === null
          ? 'Invalid profile ID'
          : 'Profile data updated successfully'
      }`,
      data: {
        updatedUserData,
      },
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Error updating your data', error: err });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID).select(
      '-password'
    );

    return res.status(200).json({
      message: 'User profile',
      data: {
        user,
      },
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Error fetching user profile', error: err });
  }
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
  try {
    await OrgModel.find({ email: req.body.email })
      .exec()
      .then((users) => {
        if (users.length >= 1) {
          return res.status(409).json({
            message: 'Email is already taken!',
          });
        } else {
          if (req.body.password !== req.body.passwordConfirm) {
            return res.status(400).json({
              message: 'Password does not match!',
            });
          }
          bcrypt.hash(req.body.password, 12, (err, hash) => {
            if (err) {
              return res.status(400).json({
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
                passwordConfirm: hash,
              });

              organization.passwordConfirm = 'True';
              organization
                .save()
                .then((result) => {
                  return res.status(201).json({ message: result });
                })
                .catch((err) => {
                  return res.status(400).json({ error: err });
                });
            }
          });
        }
      });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Error creating an account', error: err });
  }
};

exports.updateOrgData = async (req, res) => {
  try {
    const orgDataToUpdate = req.body;
    if (req.body.password) {
      return res.status(400).json({
        message: 'This route is not for password reset!',
      });
    }
    if (req.body.email) {
      return res.status(400).json({
        message: `Sorry, you can't update your email at the moment!`,
      });
    }
    const updatedOrgData = await OrgModel.findByIdAndUpdate(
      req.params.id,
      orgDataToUpdate,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: `${
        updatedOrgData === null
          ? 'Invalid profile ID'
          : 'Profile data updated successfully'
      }`,
      data: {
        updatedOrgData,
      },
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Error updating your data', error: err });
  }
};

exports.orgProfile = async (req, res) => {
  try {
    const user = await OrgModel.findById(req.params.userID).select('-password');
    return res.status(200).json({
      message: 'user profile',
      data: {
        user,
      },
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Error fetching user profile', error: err });
  }
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
  try {
    await UserModel.find({ email: req.body.email })
      .exec()
      .then((users) => {
        if (users.length == 0) {
          return res.status(404).json({ message: 'Email does not exist' });
        }
        bcrypt.compare(req.body.password, users[0].password, (err, same) => {
          if (err) {
            return res.status(401).json({ message: 'Invalid password' });
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
          return res.status(401).json({ message: 'Invalid password' });
        });
      })
      .catch((err) => {
        return res.status(400).json({
          error: err,
        });
      });
  } catch (err) {
    return res.status(400).json({ message: 'Error logging in', error: err });
  }
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
  try {
    await OrgModel.find({ email: req.body.email })
      .exec()
      .then((users) => {
        if (users.length == 0) {
          return res.status(404).json({ message: 'Email does not exist' });
        }
        bcrypt.compare(req.body.password, users[0].password, (err, same) => {
          if (err) {
            return res.status(401).json({ message: 'Invalid password' });
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
          return res.status(401).json({ message: 'Invalid password' });
        });
      })
      .catch((err) => {
        return res.status(400).json({
          error: err,
        });
      });
  } catch (err) {
    return res.status(400).json({ message: 'Error logging in', error: err });
  }
};

exports.userDelete = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.userID });
    await UserModel.deleteOne({ _id: req.params.userID })
      .exec()
      // eslint-disable-next-line no-unused-vars
      .then((response) => {
        return res.status(204).json({
          message: `${
            user.role.charAt(0).toUpperCase() + user.role.slice(1)
          } deleted successfully!`,
        });
      })
      .catch((err) => {
        return res
          .status(401)
          .json({ message: `Error deleting account!`, error: err });
      });
  } catch (err) {
    return res.status(401).json({ message: `Account not found!`, error: err });
  }
};

exports.orgDelete = async (req, res) => {
  try {
    await OrgModel.deleteOne({ _id: req.params.userID })
      .exec()
      // eslint-disable-next-line no-unused-vars
      .then((response) => {
        return res
          .status(204)
          .json({ message: 'Organization deleted successfully!' });
      })
      .catch((err) => {
        return res
          .status(401)
          .json({ message: `Error deleting account`, error: err });
      });
  } catch (err) {
    return res.status(400).json({ message: `Account not found!`, error: err });
  }
};

exports.requestPasswordReset = [
  async (req, res) => {
    try {
      const { email } = req.body;

      // Verify that the token is valid
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user with the email
      const user = await UserModel.findOne({ email });

      // If the user does not exist, return an error
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      let token = TokenModel.find({ userId: user._id });
      if (token) {
        token.deleteOne();
      }
      // create reset token
      let resetToken = crypto.randomBytes(32).toString('hex');
      // create hash
      const hash = await bcrypt.hash(resetToken, 10);

      let tokenId = '';
      await new TokenModel({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      })
        .save()
        .then((newtoken) => {
          tokenId = newtoken._id;
        });

      const clientURL = 'https://fastrash-1337.ew.r.appspot.com';
      const link = `${clientURL}/resetpassword/${
        user._id
      }/${resetToken}/${tokenId.toString().substring(0, 24)}`;

      sendEmail.send(
        process.env.EMAIL_USER,
        user.email,
        'Fastrash password reset request',
        'You requested to reset your password',
        `<html lang='en'>
          <head>
            <meta charset='UTF-8' />
            <meta http-equiv='X-UA-Compatible' content='IE=edge' />
            <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            <title>Fastrash password reset</title>
          </head>
          <body>
            <p><b>Hi ${user.firstName},</b></p>
            <p>You requested to reset your password.</p>
            <p>Please, click the link below to reset your password:</p>
            <a href='${link}'>Reset Password</a>
            <br/>
            <p>If the button above does not work, please copy and paste the link below into your browser: ${link}</p>
            <br/>
            <p>If you did not request a password reset, please ignore this email and contact support.</p>
          </body>
        </html>
        `
      );
      return res
        .status(200)
        .json({ message: 'Password reset link successfully sent!' });
    } catch (err) {
      return res.status(400).json({ error: 'Error requesting password reset' });
    }
  },
];

exports.requestPasswordResetOrg = [
  async (req, res) => {
    try {
      const { email } = req.body;

      // Verify that the token is valid
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user with the email
      const user = await OrgModel.findOne({ email });

      // If the user does not exist, return an error
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      let token = TokenModel.find({ userId: user._id });
      if (token) {
        token.deleteOne();
      }
      // create reset token
      let resetToken = crypto.randomBytes(32).toString('hex');
      // create hash
      const hash = await bcrypt.hash(resetToken, 10);

      let tokenId = '';
      await new TokenModel({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      })
        .save()
        .then((newtoken) => {
          tokenId = newtoken._id;
        });

      const clientURL = 'https://fastrash-1337.ew.r.appspot.com';
      const link = `${clientURL}/org/resetpassword/${
        user._id
      }/${resetToken}/${tokenId.toString().substring(0, 24)}`;

      sendEmail.send(
        process.env.EMAIL_USER,
        user.email,
        'Fastrash password reset request',
        'You requested to reset your password',
        `<html lang='en'>
          <head>
            <meta charset='UTF-8' />
            <meta http-equiv='X-UA-Compatible' content='IE=edge' />
            <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            <title>Fastrash password reset</title>
          </head>
          <body>
            <p><b>Dear ${user.businessName},</b></p>
            <p>Someone at your organization requested to reset your password.</p>
            <p>Please, click the link below to reset your password:</p>
            <a href='${link}'>Reset Password</a>
            <br/>
            <p>If the button above does not work, please copy and paste the link below into your browser: ${link}</p>
            <br/>
            <p>If you did not request a password reset, please ignore this email and contact support</p>
          </body>
        </html>`
      );
      return res
        .status(200)
        .json({ message: 'Password reset link successfully sent!' });
    } catch (err) {
      return res.status(400).json({ error: 'Error requesting password reset' });
    }
  },
];

exports.resetPassword = [
  async (req, res) => {
    try {
      // destructure userID and token from params
      let { userID, token, tokenID } = req.params;
      // destructure password from body
      let { password } = req.body;

      let passwordResetToken = await TokenModel.findOne({ _id: tokenID });

      if (!passwordResetToken) {
        throw new Error('Invalid or expired password reset token');
      }

      const isValid = await bcrypt.compare(token, passwordResetToken.token);

      if (!isValid) {
        throw new Error('Invalid or expired password reset token');
      }

      const hash = await bcrypt.hash(password, 12);

      await UserModel.updateOne(
        { _id: userID },
        { $set: { password: hash } },
        { new: true }
      );

      const user = await UserModel.findById({ _id: userID });

      sendEmail.send(
        process.env.EMAIL_USER,
        user.email,
        'Fastrash: Your password has changed!',
        'Password request successful',
        `<html lang='en'>
          <head>
            <meta charset='UTF-8' />
            <meta http-equiv='X-UA-Compatible' content='IE=edge' />
            <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            <title>Your fastrash password has changed!</title>
          </head>
          <body>
            <p><b>Hi ${user.firstName},</b></p>
            <p>You have successfully reset your password</p>
            <p>If you did not request a password reset, please contact support</p>
          </body>
        </html>`
      );

      await passwordResetToken.deleteOne();
      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
      return res.status(400).json({ error: 'Error changing your password' });
    }
  },
];

exports.resetPasswordOrg = [
  async (req, res) => {
    try {
      // destructure userID and token from params
      const { userID, token, tokenID } = req.params;
      // destructure password from body
      const { password } = req.body;

      let passwordResetToken = await TokenModel.findOne({ _id: tokenID });

      if (!passwordResetToken) {
        throw new Error('Invalid or expired password reset token');
      }

      const isValid = await bcrypt.compare(token, passwordResetToken.token);

      if (!isValid) {
        throw new Error('Invalid or expired password reset token');
      }

      const hash = await bcrypt.hash(password, 12);

      await OrgModel.updateOne(
        { _id: userID },
        { $set: { password: hash } },
        { new: true }
      );

      const user = await OrgModel.findById({ _id: userID });

      sendEmail.send(
        process.env.EMAIL_USER,
        user.email,
        'Fastrash: Your password has changed!',
        'Password request successful',
        `<html lang='en'>
          <head>
            <meta charset='UTF-8' />
            <meta http-equiv='X-UA-Compatible' content='IE=edge' />
            <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            <title>Your fastrash password has changed!</title>
          </head>
          <body>
            <p><b>Hello ${user.businessName},</b></p>
            <p>You have successfully reset your password</p>
            <p>If you did not request a password reset, please contact support</p>
          </body>
        </html>`
      );

      await passwordResetToken.deleteOne();
      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
      return res.status(400).json({ error: 'Error changing your password' });
    }
  },
];
