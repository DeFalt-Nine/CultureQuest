const express = require('express');
const router = express.Router();

// @desc    Health check for the API
// @route   GET /api/health
// @access  Public
// This route is used to confirm the serverless function is alive and responding
// without the overhead of a database connection.
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

module.exports = router;