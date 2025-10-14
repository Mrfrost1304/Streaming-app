import { useCallback, useEffect } from 'react';
import { useStream } from '../context/StreamContext.jsx';
import { useStreamAPI } from './useStreamAPI.jsx';

export const useDragOverlay = (videoContainerRef) => {
  const { state, actions } = useStream();
  const { updateOverlay } = useStreamAPI();

  const handleMouseDown = useCallback((e, overlay) => {
    e.preventDefault();
    actions.setIsDragging(true);
    actions.setDragOverlay(overlay);
    actions.setSelectedOverlay(overlay._id);
  }, [actions]);

  const handleMouseMove = useCallback((e) => {
    if (!state.isDragging || !state.dragOverlay || !videoContainerRef.current) return;
    
    const containerRect = videoContainerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    
    const updatedOverlay = {
      ...state.dragOverlay,
      position: {
        x: Math.max(0, Math.min(x, containerRect.width - state.dragOverlay.size.width)),
        y: Math.max(0, Math.min(y, containerRect.height - state.dragOverlay.size.height))
      }
    };
    
    actions.updateOverlay(updatedOverlay);
  }, [state.isDragging, state.dragOverlay, videoContainerRef, actions]);

  const handleMouseUp = useCallback(async () => {
    if (state.isDragging && state.dragOverlay) {
      try {
        await updateOverlay(state.dragOverlay._id, state.dragOverlay);
      } catch (err) {
        console.error('Error updating overlay position:', err);
      }
    }
    actions.setIsDragging(false);
    actions.setDragOverlay(null);
  }, [state.isDragging, state.dragOverlay, updateOverlay, actions]);

  useEffect(() => {
    if (state.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp]);

  return { handleMouseDown };
};