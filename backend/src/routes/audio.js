// backend/src/routes/audio.js

/**
 * Purpose:
 *  - Endpoint to upload an audio file, send it to Whisper microservice, and store transcription in DB.
 *  - Uses multer to handle file uploads and axios to communicate with the microservice.
 */

const express  = require('express');
const multer   = require('multer');
const router   = express.Router();
const axios    = require('axios');
const verifyToken = require('../middleware/auth');
const DiaryEntry  = require('../models/DiaryEntry');

// Configure multer to store files in memory as a buffer
const storage = multer.memoryStorage();
const upload  = multer({ storage });

/**
 * Endpoint: POST /api/audio/upload
 * This route:
 *  1) Verifies user token.
 *  2) Receives an audio file in memory.
 *  3) Sends it to the Whisper microservice for transcription.
 *  4) Saves the transcript to the DiaryEntry model.
 *  5) Returns a success response containing the newly created entry.
 */
router.post(
  '/upload',
  verifyToken,              // Ensures the user is authenticated
  upload.single('audiofile'),
  async (req, res) => {
    try {
      // Check if file was provided
      if (!req.file) {
        return res.status(400).json({ error: 'No audio file uploaded' });
      }

      // Send audio buffer to the Whisper microservice
      const whisperResponse = await axios.post(
        'http://127.0.0.1:8000/transcribe',
        req.file.buffer,
        {
          headers: { 'Content-Type': 'application/octet-stream' },
        }
      );

      const transcription = whisperResponse.data.transcription;

      // Create new diary entry in the database
      const newEntry = new DiaryEntry({
        userId: req.userId, // userId from the token payload
        transcript: transcription,
        date: new Date(),
      });
      await newEntry.save();

      return res.status(200).json({
        success: true,
        message: 'File uploaded & transcribed successfully!',
        entry: newEntry 
      });

    } catch (error) {
      console.error('Upload/Transcription error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Something went wrong while uploading or transcribing',
        error: error.message
      });
    }
  }
);

module.exports = router;
