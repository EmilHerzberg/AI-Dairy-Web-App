// backend/src/models/DiaryEntry.js
const mongoose = require('mongoose');

/**
 * DiaryEntry stores:
 *  - userId: ObjectId referencing the User model
 *  - transcript: the transcribed text of the audio
 *  - date: the date when the entry was created or recorded
 */
const DiaryEntrySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  transcript: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  }
});

module.exports = mongoose.model('DiaryEntry', DiaryEntrySchema);
