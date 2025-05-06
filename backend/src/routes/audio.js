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

// router.post('/upload', async (req, res) => {

//   // 1) Verify JWT
//   verifyToken(req, res, (err) => {
//     if (err) {
//       // verifyToken should already have sent a 401 response
//       return;
//     }

//     // 2) Handle file upload
//     upload.single('audiofile')(req, res, async (err) => {
      
//       if (err) {
//         console.error('Upload error:', err);
//         return res.status(400).json({ error: err.message });
//       }

//       // 3) At this point, req.user is set and req.file is available
//       if (!req.file) {
//         return res.status(400).json({ error: 'No audio file uploaded' });
//       }

//       try {
//         // 4) Forward the file buffer to the Whisper microservice
//         const response = await axios.post(
//           'http://127.0.0.1:8000/transcribe',
//           req.file.buffer,
//           { headers: { 'Content-Type': 'application/octet-stream' } }
//         );

//         const transcription = response.data.transcription;

//         // 5) Save transcription to the database
//         const newEntry = new DiaryEntry({
//           userId:     req.user.id,
//           transcript: transcription,
//           date:       new Date()
//         });
//         await newEntry.save();

//         res.json({
//           message:       'File uploaded and transcribed',
//           transcription
//         });
//       } catch (error) {
//         console.error('Transcription error:', error);
//         res
//           .status(500)
//           .json({ error: 'Something went wrong while uploading or transcribing' });
//       }
//     });
//   });
// });

module.exports = router;
