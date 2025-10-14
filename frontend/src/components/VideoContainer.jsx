import React, { useRef, useEffect } from 'react';
import { useStream } from '../context/StreamContext.jsx';
import { useDragOverlay } from '../hooks/useDragOverlay.jsx';
import StreamSetup from './StreamSetup.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import VideoControls from './VideoControls.jsx';
import Overlay from './Overlay.jsx';
const VideoContainer = () => {
  const { state, actions } = useStream();
  const videoContainerRef = useRef(null);
  const { handleMouseDown } = useDragOverlay(videoContainerRef);

  useEffect(() => {
    // Initialize video controls when stream starts
    if (state.streamUrl && videoContainerRef.current) {
      const video = videoContainerRef.current.querySelector('video');
      if (video) {
        video.volume = state.volume;
        video.muted = state.isMuted;
      }
    }
  }, [state.streamUrl, state.volume, state.isMuted]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-purple-500/30">
      <div className="relative aspect-video bg-black" ref={videoContainerRef}>
        {!state.streamUrl ? (
          <StreamSetup />
        ) : (
          <>
            <VideoPlayer />
            {state.overlays.map((overlay, idx) => (
              <Overlay
                key={overlay._id || idx}
                overlay={overlay}
                isSelected={state.selectedOverlay === overlay._id}
                isDragging={state.isDragging && state.dragOverlay?._id === overlay._id}
                onMouseDown={handleMouseDown}
                onClick={actions.setSelectedOverlay}
              />
            ))}
          </>
        )}
      </div>

      {state.streamUrl && <VideoControls />}
    </div>
  );
};

export default VideoContainer;