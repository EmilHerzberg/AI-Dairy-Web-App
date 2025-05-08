// backend/src/routes/auth.js

/**
 * Purpose:
 *  - Contains routes for user registration and login.
 *  - Creates/validates JWT tokens for authenticated access.
 */

const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const router = express.Router();

/**
 * POST /auth/register
 * Flow:
 *  1) Check if user with the given email already exists.
 *  2) Hash the provided password.
 *  3) Create a new user in the database.
 *  4) Generate a JWT and return it.
 */
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    // 1) Check for existing user by email
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email already in use' });

    // 2) Hash password
    const salt   = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // 3) Create user in DB
    user = new User({ email, username, password: hashed });
    await user.save();

    // 4) Generate JWT
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 * POST /auth/login
 * Flow:
 *  1) Find user by email.
 *  2) Compare password with stored hash.
 *  3) Generate JWT if successful.
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // 2) Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // 3) Generate JWT
    const payload = { userId: user.id };
    
    // Using sign without expiresIn for demonstration, or you can re-enable it:
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    //   OR
    // const token = jwt.sign(payload, process.env.JWT_SECRET, {
    //   expiresIn: process.env.TOKEN_EXPIRES_IN,
    // });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/**
 * GET /auth/dev-token
 * Helper for development: 
 * Returns a token for testing without logging in if needed.
 */
router.get('/dev-token', (req, res) => {
  const token = jwt.sign(
    { userId: '680fb3a44f46a98f56ee5efe', email: 'dummy@example.com' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token });
});

module.exports = router;
