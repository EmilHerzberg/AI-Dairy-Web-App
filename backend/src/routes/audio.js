const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { verifyToken } = require('../middleware/auth'); // <-- your JWT auth middleware

// Configure multer (in-memory or store to disk):
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// POST /api/audio/upload
router.post('/upload', verifyToken, upload.single('audiofile'), async (req, res) => {
  try {
    // req.file is the audio file
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Optionally, you can store the file to disk if needed
    // For a quick pass, we can just keep it in memory and send it to Python.

    // Forward the file buffer to your Python microservice
    const response = await axios.post(
      'http://localhost:8000/transcribe', // URL to your Python microservice
      req.file.buffer,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    const transcription = response.data.transcription;

    // Now save transcription to DB with user ID and current date
    const userId = req.user.id; // from your JWT payload
    const DiaryEntry = require('../models/DiaryEntry');

    const newEntry = new DiaryEntry({
      userId,
      transcript: transcription,
      date: new Date()
    });

    await newEntry.save();

    res.json({
      message: 'File uploaded and transcribed',
      transcription
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while uploading or transcribing' });
  }
});

module.exports = router;
