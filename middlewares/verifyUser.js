const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSecret = process.env.JWT_SECRET;

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
