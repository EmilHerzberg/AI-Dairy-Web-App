const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    // 1. Check for existing user
    let user = await User.findOne({ email });
    console.log("Register hit", req.body);
    if (user) return res.status(400).json({ msg: 'Email already in use' });

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // 3. Create user
    user = new User({ email, username, password: hashed });
    await user.save();

    // 4. Generate JWT
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

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // 3. Generate JWT
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('TOKEN_EXPIRES_IN:', process.env.TOKEN_EXPIRES_IN);
    const payload = { userId: user.id };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // const token = jwt.sign(payload, process.env.JWT_SECRET, {
    //   expiresIn: process.env.TOKEN_EXPIRES_IN,
    // });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/dev-token', (req, res) => {
  const token = jwt.sign(
    { userId: '680fb3a44f46a98f56ee5efe', email: 'dummy@example.com' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token });
});

module.exports = router;
