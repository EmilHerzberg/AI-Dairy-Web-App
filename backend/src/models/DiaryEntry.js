// models/DiaryEntry.js
const mongoose = require('mongoose');

const DiaryEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transcript: { type: String, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('DiaryEntry', DiaryEntrySchema);
