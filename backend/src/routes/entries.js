// backend/src/routes/entries.js

/**
 * Purpose:
 *  - Provides an endpoint to fetch all diary entries belonging to the authenticated user.
 *  - Sorted by date, newest first.
 */

const express     = require('express');
const DiaryEntry  = require('../models/DiaryEntry');
const verifyToken = require('../middleware/auth');
const router      = express.Router();

/**
 * GET /api/entries
 * Returns all diary entries for the authenticated user,
 * sorted by date (descending).
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    // The userId is set in the verifyToken middleware
    const userId = req.userId;
    
    // Find all entries that match this user, sorted by date descending
    const entries = await DiaryEntry.find({ userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
