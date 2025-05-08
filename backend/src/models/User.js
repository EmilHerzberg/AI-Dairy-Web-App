// backend/src/models/User.js
const mongoose = require('mongoose');

/**
 * User schema:
 *  - email (unique, lowercase)
 *  - username (optional field)
 *  - password (hashed using bcrypt before storing)
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
