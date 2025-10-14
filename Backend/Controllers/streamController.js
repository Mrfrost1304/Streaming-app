const { spawn } = require('child_process');

/**
 * @desc    Stream video from URL using FFmpeg
 * @access  Public
 */
const streamVideo = (req, res) => {
  const streamUrl = req.query.url;
  
  if (!streamUrl) {
    return res.status(400).json({ error: 'Stream URL is required' });
  }
  
  // Set proper headers for MP4 streaming
  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Range',
    'Cache-Control': 'no-cache',
    'Accept-Ranges': 'bytes'
  });
  
  // FFmpeg command for MP4 output (single file stream)
  const ffmpeg = spawn('ffmpeg', [
    '-i', streamUrl,
    '-c:v', 'libx264',           // H.264 video codec
    '-c:a', 'aac',               // AAC audio codec
    '-f', 'mp4',                 // MP4 format
    '-movflags', 'frag_keyframe+empty_moov+default_base_moof', // Enable streaming
    '-preset', 'ultrafast',      // Fast encoding
    '-tune', 'zerolatency',      // Low latency
    '-crf', '23',                // Quality setting
    '-maxrate', '1000k',         // Max bitrate
    '-bufsize', '2000k',         // Buffer size
    'pipe:1'
  ]);
  
  ffmpeg.stdout.pipe(res);
  
  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });
  
  ffmpeg.on('error', (err) => {
    console.error('FFmpeg error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'FFmpeg process failed to start' });
    } else {
      res.end();
    }
  });
  
  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
    if (code !== 0 && !res.headersSent) {
      res.status(500).json({ error: 'Stream processing failed' });
    } else {
      res.end();
    }
  });
  
  req.on('close', () => {
    ffmpeg.kill('SIGINT');
  });
};

module.exports = { streamVideo };