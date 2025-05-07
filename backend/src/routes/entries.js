// backend/routes/entries.js
const express    = require('express');
const DiaryEntry = require('../models/DiaryEntry');
const verifyToken = require('../middleware/auth');
const router     = express.Router();

// GET all entries for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    // req.userId is set by your verifyToken middleware
    const userId = req.userId;

    const entries = await DiaryEntry.find({ userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
