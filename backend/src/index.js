// backend/src/index.js

/**
 * Purpose:
 *  - Main entry for the Node/Express server.
 *  - Connects to MongoDB, configures Express middleware, and sets up routes.
 */

require('dotenv').config();    // Load environment variables from .env

const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./db');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const audioRoutes = require('./routes/audio');
const entriesRoute = require('./routes/entries');

/**
 * Asynchronously starts the server:
 *  1) Connect to MongoDB.
 *  2) Initialize Express.
 *  3) Apply middleware and mount routes.
 *  4) Listen on the configured port.
 */
const startServer = async () => {
  try {
    // 1) Connect to MongoDB
    await connectDB();
    console.log('✔️  MongoDB connected');

    // 2) Initialize Express app
    const app = express();

    // 3) Global middleware
    app.use(cors());        // Allow cross-origin requests from the frontend
    app.use(express.json()); // Parse incoming JSON request bodies

    // 4) Route mounting
    // Authentication routes
    app.use('/auth', authRoutes);

    // Example of a protected route usage:
    // app.get('/api/diary', authMiddleware, (req, res) => {
    //   res.json({ message: `Hello user ${req.userId}` });
    // });

    // Audio upload & transcription route
    app.use('/api/audio', audioRoutes);

    // Diary entries routes
    app.use('/api/entries', entriesRoute);

    // 5) Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, 'localhost', () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

// Invoke the start function
startServer();
