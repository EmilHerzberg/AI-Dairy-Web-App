// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * verifyToken:
 *  1) Checks for an Authorization header containing a JWT.
 *  2) Verifies the token using JWT_SECRET.
 *  3) Sets req.userId based on the decoded token's payload.
 *  4) Calls next() if valid, or returns an error if not.
 */
module.exports = function (req, res, next) {
  // Extract token from "Authorization: Bearer <token>"
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
