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

  const handleVideoError = (e) => {
    console.error('Video error:', e);
    const error = videoRef.current?.error;
    let errorMessage = 'Failed to load video stream.';
    
    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMessage = 'Video loading was aborted.';
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error occurred while loading video.';
          break;
        case error.MEDIA_ERR_DECODE:
          errorMessage = 'Video decoding error occurred.';
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Video format not supported. Please check the RTSP URL.';
          break;
        default:
          errorMessage = 'Unknown video error occurred.';
      }
    }
    
    actions.setError(errorMessage);
    console.error('Video error details:', errorMessage);
  };

  const handleLoadStart = () => {
    console.log('Video loading started');
    actions.setLoading(true);
  };

  const handleCanPlay = () => {
    console.log('Video can start playing');
    actions.setLoading(false);
  };

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      src={state.streamUrl}
      autoPlay
      playsInline
      muted={state.isMuted}
      crossOrigin="anonymous"
      onError={handleVideoError}
      onLoadStart={handleLoadStart}
      onCanPlay={handleCanPlay}
      onPlay={() => actions.setIsPlaying(true)}
      onPause={() => actions.setIsPlaying(false)}
    />
  );
};

export default VideoPlayer;