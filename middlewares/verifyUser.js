const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSecret = process.env.JWT_SECRET_USER;
const collectorSecret = process.env.JWT_SECRET_COLLECTOR;
const orgSecret = process.env.JWT_SECRET_ORGANIZATION;

exports.verifyUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, userSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

exports.verifyCollector = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, collectorSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

exports.verifyOrg = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, orgSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};
