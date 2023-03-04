const OrgModel = require('../models/OrgModel');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

exports.successResponse = function (res, msg) {
  var data = {
    status: 1,
    message: msg,
  };
  return res.status(200).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
  var resData = {
    status: 1,
    message: msg,
    data: data,
  };
  OrgModel.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length >= 1) {
        return res.status(409).json({
          message: 'Email already taken!',
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const organization = new OrgModel({
              businessName: req.body.name,
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
  return res.status(200).json(resData);
};

exports.ErrorResponse = function (res, msg) {
  var data = {
    status: 0,
    message: msg,
  };
  return res.status(500).json(data);
};

exports.notFoundResponse = function (res, msg) {
  var data = {
    status: 0,
    message: msg,
  };
  return res.status(404).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
  var resData = {
    status: 0,
    message: msg,
    data: data,
  };
  return res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
  var data = {
    status: 0,
    message: msg,
  };
  return res.status(401).json(data);
};
