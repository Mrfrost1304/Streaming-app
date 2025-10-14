import React, { useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react';
import { useStream } from '../context/StreamContext.jsx';

const VideoControls = () => {
  const { state, actions } = useStream();

  const togglePlay = () => {
    // Find the video element and control it directly
    const videoElement = document.querySelector('video');
    if (videoElement) {
      if (state.isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play().catch(console.error);
      }
    }
    // Update state after controlling the video
    actions.setIsPlaying(!state.isPlaying);
  };

  const toggleMute = () => {
    // Find the video element and control it directly
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.muted = !state.isMuted;
    }
    // Update state after controlling the video
    actions.setIsMuted(!state.isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    // Find the video element and control it directly
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.volume = newVolume;
    }
    // Update state after controlling the video
    actions.setVolume(newVolume);
  };

  return (
    <div className="p-6 bg-slate-900/80 backdrop-blur-sm border-t border-purple-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay} 
            className="p-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-all transform hover:scale-105"
          >
            {state.isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
          </button>
          <button 
            onClick={toggleMute} 
            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all"
          >
            {state.isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
          </button>
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={state.volume}
              onChange={handleVolumeChange}
              className="w-24 accent-purple-500"
            />
            <span className="text-sm text-gray-400 w-8">{Math.round(state.volume * 100)}%</span>
          </div>
        </div>
        <button 
          onClick={() => actions.setShowSettings(!state.showSettings)}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all"
        >
          <Settings className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoControls;