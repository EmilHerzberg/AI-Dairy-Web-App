const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const axios   = require('axios');
const  verifyToken = require('../middleware/auth');
const DiaryEntry     = require('../models/DiaryEntry');

// Multer in-memory storage
const storage = multer.memoryStorage();
const upload  = multer({ storage });

router.post(
  '/upload',
  verifyToken,
  upload.single('audiofile'),
  async (req, res) => {
    try {
      // 1) Ensure a file is present
      if (!req.file) {
        return res.status(400).json({ error: 'No audio file uploaded' });
      }

      // 2) Send file buffer to Whisper microservice
      const whisperResponse = await axios.post(
        'http://127.0.0.1:8000/transcribe', // or localhost if IPv6 isn't an issue
        req.file.buffer,
        {
          headers: { 'Content-Type': 'application/octet-stream' },
        }
      );

      const transcription = whisperResponse.data.transcription;

      // 3) Save to MongoDB with userId from req.user.id
      const newEntry = new DiaryEntry({
        userId: req.userId,          
        transcript: transcription,
        date: new Date(),
      });
      await newEntry.save();

      res.json({
        message: 'File uploaded and transcribed',
        transcription,
      });
    } catch (error) {
      console.error('Upload/Transcription error:', error);
      res.status(500).json({
        error: 'Something went wrong while uploading or transcribing',
      });
    }
  }
);

module.exports = router;
