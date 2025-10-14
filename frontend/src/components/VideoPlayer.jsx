import React, { useRef, useEffect } from 'react';
import { useStream } from '../context/StreamContext.jsx';

const VideoPlayer = () => {
  const { state, actions } = useStream();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = state.volume;
      videoRef.current.muted = state.isMuted;
    }
  }, [state.volume, state.isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (state.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      actions.setIsPlaying(!state.isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !state.isMuted;
      actions.setIsMuted(!state.isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    actions.setVolume(newVolume);
  };

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      src={state.streamUrl}
      autoPlay
      onError={(e) => {
        console.error('Video error:', e);
        alert('Failed to load video stream. Please check the RTSP URL.');
      }}
      onPlay={() => actions.setIsPlaying(true)}
      onPause={() => actions.setIsPlaying(false)}
    />
  );
};

export default VideoPlayer;