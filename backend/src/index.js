require('dotenv').config();    // 1️⃣ Load .env first

const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./db');
const authRoutes = require('./routes/auth');
const authMiddleware       = require('./middleware/auth');
const audioRoutes = require('./routes/audio');
const entriesRoute = require('./routes/entries');


const startServer = async () => {
  try {
    // 2️⃣ Connect to MongoDB before setting up Express
    await connectDB(); 
    console.log('✔️  MongoDB connected');

    // 3️⃣ Now that the DB is up, initialize Express
    const app = express();

    // 4️⃣ Middleware
    app.use(cors());   

    app.use(express.json());

    // 5️⃣ Mount your auth routes (which use your User model)
    app.use('/auth', authRoutes);

    //   //example of a protected route using your auth middleware
    // app.get('/api/diary', authMiddleware, (req, res) => {
    //   // here req.userId is populated by auth middleware
    //   res.json({ message: `Hello user ${req.userId}` });
    // });

    //api for the audio route (react mic to whisper transcription)
    app.use('/api/audio', audioRoutes);

    //route for reading diary entries for a user
    app.use('/api/entries', entriesRoute);

    // 6️⃣ Start listening only after everything’s wired
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, 'localhost', () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
