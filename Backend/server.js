const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

require('./dbconfig'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for HLS
app.use('/hls', express.static(path.join(__dirname, 'hls_output')));

// ===== OVERLAY CRUD ENDPOINTS =====

/**
 * @route   GET /api/overlays
 * @desc    Get all overlays
 * @access  Public
 */
const overlayRouter = require('./router/overlayRouter');
app.use('/api/overlays', overlayRouter);

// ===== SETTINGS CRUD ENDPOINTS =====

/**
 * @route   GET /api/settings
 * @desc    Get application settings
 * @access  Public
 */
const settingRouter = require('./router/settingRouter');
app.use('/api/settings', settingRouter);

// ===== STREAMING ENDPOINTS =====

/**
 * @route   GET /api/stream
 * @desc    Convert video stream (RTSP/HTTP/HTTPS) to HTTP stream
 * @query   url - Video stream URL (.mp4, .m3u8, RTSP, etc.)
 * @access  Public
 */
const streamRouter = require('./router/StreamRouter');
app.use('/', streamRouter);

// ===== HEALTH CHECK =====

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});