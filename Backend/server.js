const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/livestream_app';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Overlay Schema
const overlaySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  position: {
    x: { type: Number, default: 50 },
    y: { type: Number, default: 50 }
  },
  size: {
    width: { type: Number, default: 200 },
    height: { type: Number, default: 50 }
  },
  style: {
    color: { type: String, default: '#ffffff' },
    fontSize: { type: Number, default: 24 },
    fontWeight: { type: String, default: 'bold' },
    backgroundColor: { type: String, default: 'rgba(0,0,0,0.5)' }
  }
}, {
  timestamps: true
});

const Overlay = mongoose.model('Overlay', overlaySchema);

// Settings Schema
const settingsSchema = new mongoose.Schema({
  rtspUrl: {
    type: String,
    default: ''
  },
  streamQuality: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'high'
  },
  bufferSize: {
    type: Number,
    default: 1024
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

// ===== OVERLAY CRUD ENDPOINTS =====

/**
 * @route   GET /api/overlays
 * @desc    Get all overlays
 * @access  Public
 */
app.get('/api/overlays', async (req, res) => {
  try {
    const overlays = await Overlay.find().sort({ createdAt: -1 });
    res.json(overlays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/overlays/:id
 * @desc    Get single overlay by ID
 * @access  Public
 */
app.get('/api/overlays/:id', async (req, res) => {
  try {
    const overlay = await Overlay.findById(req.params.id);
    
    if (!overlay) {
      return res.status(404).json({ error: 'Overlay not found' });
    }
    
    res.json(overlay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/overlays
 * @desc    Create new overlay
 * @access  Public
 * @body    { type, content, position, size, style }
 */
app.post('/api/overlays', async (req, res) => {
  try {
    const { type, content, position, size, style } = req.body;
    
    // Validation
    if (!type || !content) {
      return res.status(400).json({ error: 'Type and content are required' });
    }
    
    if (!['text', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "text" or "image"' });
    }
    
    const overlay = new Overlay({
      type,
      content,
      position: position || { x: 50, y: 50 },
      size: size || { width: 200, height: 50 },
      style: style || {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }
    });
    
    const savedOverlay = await overlay.save();
    res.status(201).json(savedOverlay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   PUT /api/overlays/:id
 * @desc    Update overlay
 * @access  Public
 */
app.put('/api/overlays/:id', async (req, res) => {
  try {
    const { type, content, position, size, style } = req.body;
    
    const updateData = {};
    if (type) updateData.type = type;
    if (content) updateData.content = content;
    if (position) updateData.position = position;
    if (size) updateData.size = size;
    if (style) updateData.style = style;
    
    const overlay = await Overlay.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!overlay) {
      return res.status(404).json({ error: 'Overlay not found' });
    }
    
    res.json(overlay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   DELETE /api/overlays/:id
 * @desc    Delete overlay
 * @access  Public
 */
app.delete('/api/overlays/:id', async (req, res) => {
  try {
    const overlay = await Overlay.findByIdAndDelete(req.params.id);
    
    if (!overlay) {
      return res.status(404).json({ error: 'Overlay not found' });
    }
    
    res.json({ message: 'Overlay deleted successfully', overlay });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== SETTINGS CRUD ENDPOINTS =====

/**
 * @route   GET /api/settings
 * @desc    Get application settings
 * @access  Public
 */
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = new Settings({
        rtspUrl: '',
        streamQuality: 'high',
        bufferSize: 1024
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   PUT /api/settings
 * @desc    Update application settings
 * @access  Public
 */
app.put('/api/settings', async (req, res) => {
  try {
    const { rtspUrl, streamQuality, bufferSize } = req.body;
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({
        rtspUrl,
        streamQuality,
        bufferSize
      });
    } else {
      if (rtspUrl !== undefined) settings.rtspUrl = rtspUrl;
      if (streamQuality !== undefined) settings.streamQuality = streamQuality;
      if (bufferSize !== undefined) settings.bufferSize = bufferSize;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== STREAMING ENDPOINTS =====

/**
 * @route   GET /api/stream
 * @desc    Convert RTSP stream to HTTP stream
 * @query   url - RTSP URL to stream
 * @access  Public
 */
app.get('/api/stream', (req, res) => {
  const rtspUrl = req.query.url;
  
  if (!rtspUrl) {
    return res.status(400).json({ error: 'RTSP URL is required' });
  }
  
  res.writeHead(200, {
    'Content-Type': 'video/mp2t',
    'Transfer-Encoding': 'chunked'
  });
  
  // FFmpeg command to convert RTSP to HTTP stream
  const ffmpeg = spawn('ffmpeg', [
    '-i', rtspUrl,
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-codec:a', 'mp2',
    '-b:v', '1000k',
    '-bf', '0',
    '-muxdelay', '0.001',
    'pipe:1'
  ]);
  
  ffmpeg.stdout.pipe(res);
  
  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });
  
  ffmpeg.on('error', (err) => {
    console.error('FFmpeg error:', err);
    res.end();
  });
  
  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
    res.end();
  });
  
  req.on('close', () => {
    ffmpeg.kill('SIGINT');
  });
});

/**
 * @route   POST /api/stream/hls
 * @desc    Convert RTSP stream to HLS format
 * @body    { rtspUrl, outputPath }
 * @access  Public
 */
app.post('/api/stream/hls', async (req, res) => {
  try {
    const { rtspUrl, outputPath = './hls_output' } = req.body;
    
    if (!rtspUrl) {
      return res.status(400).json({ error: 'RTSP URL is required' });
    }
    
    const fs = require('fs');
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
    
    // FFmpeg command for HLS conversion
    const ffmpeg = spawn('ffmpeg', [
      '-i', rtspUrl,
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-f', 'hls',
      '-hls_time', '2',
      '-hls_list_size', '10',
      '-hls_flags', 'delete_segments',
      `${outputPath}/stream.m3u8`
    ]);
    
    ffmpeg.stderr.on('data', (data) => {
      console.log(`FFmpeg: ${data}`);
    });
    
    ffmpeg.on('error', (err) => {
      console.error('FFmpeg error:', err);
    });
    
    res.json({
      message: 'HLS conversion started',
      hlsUrl: '/hls/stream.m3u8'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/stream/info
 * @desc    Get stream information
 * @query   url - RTSP URL
 * @access  Public
 */
app.get('/api/stream/info', (req, res) => {
  const rtspUrl = req.query.url;
  
  if (!rtspUrl) {
    return res.status(400).json({ error: 'RTSP URL is required' });
  }
  
  const ffprobe = spawn('ffprobe', [
    '-v', 'quiet',
    '-print_format', 'json',
    '-show_format',
    '-show_streams',
    rtspUrl
  ]);
  
  let output = '';
  
  ffprobe.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  ffprobe.on('close', (code) => {
    if (code === 0) {
      try {
        const info = JSON.parse(output);
        res.json(info);
      } catch (error) {
        res.status(500).json({ error: 'Failed to parse stream info' });
      }
    } else {
      res.status(500).json({ error: 'Failed to get stream info' });
    }
  });
  
  ffprobe.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

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