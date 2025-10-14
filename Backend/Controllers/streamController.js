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
  
  res.writeHead(200, {
    'Content-Type': 'video/mp2t',
    'Transfer-Encoding': 'chunked'
  });
  
  // FFmpeg command to convert stream to HTTP
  const ffmpeg = spawn('ffmpeg', [
    '-i', streamUrl,
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

module.exports = {
  streamVideo
};