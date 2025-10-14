const express = require('express');
const streamRouter = express.Router();
const { streamVideo } = require('../Controllers/streamController');

/**
 * @route   GET /api/stream
 * @desc    Stream video from URL using FFmpeg
 * @access  Public
 */
streamRouter.get('/api/stream', streamVideo);

module.exports = streamRouter;