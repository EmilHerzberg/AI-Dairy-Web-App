const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🛠  Connecting with URI:', process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;


