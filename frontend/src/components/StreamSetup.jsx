import React from 'react';
import { Play } from 'lucide-react';
import { useStream } from '../context/StreamContext';

const StreamSetup = () => {
  const { state, actions } = useStream();

  const handleStreamStart = () => {
    if (!state.rtspUrl) {
      alert('Please enter an RTSP URL');
      return;
    }
    const streamUrl = `http://localhost:5000/api/stream?url=${encodeURIComponent(state.rtspUrl)}`;
    actions.setStreamUrl(streamUrl);
    actions.setIsPlaying(true);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-8">
        <Play className="w-16 h-16 text-white ml-2" />
      </div>
      <h3 className="text-2xl font-semibold text-white mb-4">Ready to Stream</h3>
      <p className="text-gray-400 text-lg mb-8">Enter your RTSP URL to begin broadcasting</p>
      <div className="w-full max-w-lg px-8">
        <div className="relative">
          <input
            type="text"
            placeholder="rtsp://example.com/stream"
            value={state.rtspUrl}
            onChange={(e) => actions.setRtspUrl(e.target.value)}
            className="w-full px-6 py-4 bg-slate-700/80 text-white rounded-2xl border border-purple-500/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-lg"
          />
        </div>
        <button
          onClick={handleStreamStart}
          className="w-full mt-4 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Start Streaming
        </button>
      </div>
    </div>
  );
};

export default StreamSetup;