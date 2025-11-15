require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();

// Middleware
// Enable CORS for all routes. The Vercel proxy should handle same-origin, but this is good practice.
app.use(cors()); 
// Body parser middleware
app.use(express.json());

// A middleware to ensure the database connection is established for DB-dependent routes
const ensureDbConnection = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    // Return a 503 Service Unavailable error
    res.status(503).json({ message: 'Service temporarily unavailable. Please try again later.' });
  }
};

// Define routes
// Health check route - does not need DB
app.use('/health', require('./routes/health'));

// Chatbot route - does not need DB
app.use('/chatbot', require('./routes/chatbot'));

// Tourist spots routes - apply the DB connection middleware ONLY to routes that need it
app.use('/tourist-spots', ensureDbConnection, require('./routes/touristSpots'));

// Export the app for Vercel. Vercel's runtime will handle starting the server.
module.exports = app;