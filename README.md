# RTSP Livestream Player

A full-stack application for streaming RTSP video feeds with overlay management capabilities.

## 🚀 Features

- **RTSP Video Streaming**: Convert RTSP streams to web-compatible formats
- **Overlay Management**: Add text and image overlays to your streams
- **Real-time Controls**: Play, pause, volume control
- **HLS Support**: Convert streams to HLS format for better compatibility
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **FFmpeg** for video processing
- **CORS** enabled for cross-origin requests

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **Lucide React** for icons

## 📋 Prerequisites

- Node.js (>= 16.0.0)
- MongoDB (local or cloud)
- FFmpeg installed on your system

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

The backend `.env` file has been created with default settings:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/livestream_app
```

### 3. Start the Application

```bash
# Terminal 1: Start backend server
cd Backend
npm run dev

# Terminal 2: Start frontend development server
cd frontend
npm run dev
```

## 🐛 Bugs Fixed

### ✅ Critical Issues Resolved

1. **API URL Mismatch**: Fixed frontend API base URL from `localhost:3000` to `localhost:5000`
2. **Environment Configuration**: Created `.env` file with proper MongoDB and port configuration
3. **Deprecated Mongoose Options**: Removed deprecated `useNewUrlParser` and `useUnifiedTopology` options
4. **Static File Serving**: Added static file serving for HLS output directory
5. **FFmpeg Error Handling**: Improved error handling for FFmpeg processes
6. **Frontend Title**: Updated generic title to "RTSP Livestream Player"
7. **CSS Conflicts**: Fixed conflicting Tailwind CSS classes

### 🔧 Additional Improvements

- Enhanced error logging for better debugging
- Improved FFprobe error handling
- Better process cleanup on client disconnect
- Added proper HTTP status codes for different error scenarios

## 📡 API Endpoints

### Overlays
- `GET /api/overlays` - Get all overlays
- `GET /api/overlays/:id` - Get specific overlay
- `POST /api/overlays` - Create new overlay
- `PUT /api/overlays/:id` - Update overlay
- `DELETE /api/overlays/:id` - Delete overlay

### Streaming
- `GET /api/stream?url=<stream_url>` - Stream video (RTSP/HTTP/HTTPS)
- `POST /api/stream/hls` - Convert to HLS format
- `GET /api/stream/info?url=<rtsp_url>` - Get stream information

### Settings
- `GET /api/settings` - Get application settings
- `PUT /api/settings` - Update settings

### Health
- `GET /api/health` - Health check endpoint

## 🎯 Usage

1. **Start Streaming**: Enter an RTSP URL and click "Start Streaming"
2. **Add Overlays**: Click the "+" button to add text or image overlays
3. **Customize**: Adjust overlay position, size, and styling
4. **Control Playback**: Use play/pause and volume controls

## 🔍 Troubleshooting

### Common Issues

1. **FFmpeg not found**: Ensure FFmpeg is installed and in your system PATH
2. **MongoDB connection failed**: Check if MongoDB is running and connection string is correct
3. **CORS errors**: Backend has CORS enabled, but ensure frontend is running on the correct port
4. **Stream not loading**: Verify the RTSP URL is accessible and valid

### Development Tips

- Check browser console for frontend errors
- Monitor backend console for server logs
- Use the health endpoint to verify server status
- Test with sample RTSP URLs first

## 📝 Notes

- The application uses FFmpeg for video processing, which must be installed separately
- MongoDB is required for overlay persistence
- HLS output files are stored in the `Backend/hls_output` directory
- The application supports both local and cloud MongoDB instances

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
