import React, { createContext, useContext, useReducer, useCallback } from 'react';

const StreamContext = createContext();

// Action types
const ACTIONS = {
  SET_RTSP_URL: 'SET_RTSP_URL',
  SET_STREAM_URL: 'SET_STREAM_URL',
  SET_IS_PLAYING: 'SET_IS_PLAYING',
  SET_IS_MUTED: 'SET_IS_MUTED',
  SET_VOLUME: 'SET_VOLUME',
  SET_OVERLAYS: 'SET_OVERLAYS',
  ADD_OVERLAY: 'ADD_OVERLAY',
  UPDATE_OVERLAY: 'UPDATE_OVERLAY',
  DELETE_OVERLAY: 'DELETE_OVERLAY',
  SET_SELECTED_OVERLAY: 'SET_SELECTED_OVERLAY',
  SET_SHOW_OVERLAY_FORM: 'SET_SHOW_OVERLAY_FORM',
  SET_OVERLAY_FORM: 'SET_OVERLAY_FORM',
  RESET_OVERLAY_FORM: 'RESET_OVERLAY_FORM',
  SET_IS_DRAGGING: 'SET_IS_DRAGGING',
  SET_DRAG_OVERLAY: 'SET_DRAG_OVERLAY',
  SET_SHOW_SETTINGS: 'SET_SHOW_SETTINGS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  rtspUrl: '',
  streamUrl: '',
  isPlaying: false,
  isMuted: false,
  volume: 1,
  overlays: [],
  selectedOverlay: null,
  showOverlayForm: false,
  overlayForm: {
    type: 'text',
    content: '',
    position: { x: 50, y: 50 },
    size: { width: 200, height: 50 },
    style: {
      color: '#ffffff',
      fontSize: 24,
      fontWeight: 'bold',
      backgroundColor: 'rgba(0,0,0,0.5)'
    }
  },
  isDragging: false,
  dragOverlay: null,
  showSettings: false,
  loading: false,
  error: null
};

// Reducer
const streamReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_RTSP_URL:
      return { ...state, rtspUrl: action.payload };
    case ACTIONS.SET_STREAM_URL:
      return { ...state, streamUrl: action.payload };
    case ACTIONS.SET_IS_PLAYING:
      return { ...state, isPlaying: action.payload };
    case ACTIONS.SET_IS_MUTED:
      return { ...state, isMuted: action.payload };
    case ACTIONS.SET_VOLUME:
      return { ...state, volume: action.payload };
    case ACTIONS.SET_OVERLAYS:
      return { ...state, overlays: action.payload };
    case ACTIONS.ADD_OVERLAY:
      return { ...state, overlays: [...state.overlays, action.payload] };
    case ACTIONS.UPDATE_OVERLAY:
      return {
        ...state,
        overlays: state.overlays.map(o => o._id === action.payload._id ? action.payload : o)
      };
    case ACTIONS.DELETE_OVERLAY:
      return { ...state, overlays: state.overlays.filter(o => o._id !== action.payload) };
    case ACTIONS.SET_SELECTED_OVERLAY:
      return { ...state, selectedOverlay: action.payload };
    case ACTIONS.SET_SHOW_OVERLAY_FORM:
      return { ...state, showOverlayForm: action.payload };
    case ACTIONS.SET_OVERLAY_FORM:
      return { ...state, overlayForm: { ...state.overlayForm, ...action.payload } };
    case ACTIONS.RESET_OVERLAY_FORM:
      return { ...state, overlayForm: initialState.overlayForm };
    case ACTIONS.SET_IS_DRAGGING:
      return { ...state, isDragging: action.payload };
    case ACTIONS.SET_DRAG_OVERLAY:
      return { ...state, dragOverlay: action.payload };
    case ACTIONS.SET_SHOW_SETTINGS:
      return { ...state, showSettings: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Provider component
export const StreamProvider = ({ children }) => {
  const [state, dispatch] = useReducer(streamReducer, initialState);

  // Memoized actions
  const actions = useCallback({
    setRtspUrl: (url) => dispatch({ type: ACTIONS.SET_RTSP_URL, payload: url }),
    setStreamUrl: (url) => dispatch({ type: ACTIONS.SET_STREAM_URL, payload: url }),
    setIsPlaying: (playing) => dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: playing }),
    setIsMuted: (muted) => dispatch({ type: ACTIONS.SET_IS_MUTED, payload: muted }),
    setVolume: (volume) => dispatch({ type: ACTIONS.SET_VOLUME, payload: volume }),
    setOverlays: (overlays) => dispatch({ type: ACTIONS.SET_OVERLAYS, payload: overlays }),
    addOverlay: (overlay) => dispatch({ type: ACTIONS.ADD_OVERLAY, payload: overlay }),
    updateOverlay: (overlay) => dispatch({ type: ACTIONS.UPDATE_OVERLAY, payload: overlay }),
    deleteOverlay: (id) => dispatch({ type: ACTIONS.DELETE_OVERLAY, payload: id }),
    setSelectedOverlay: (id) => dispatch({ type: ACTIONS.SET_SELECTED_OVERLAY, payload: id }),
    setShowOverlayForm: (show) => dispatch({ type: ACTIONS.SET_SHOW_OVERLAY_FORM, payload: show }),
    setOverlayForm: (form) => dispatch({ type: ACTIONS.SET_OVERLAY_FORM, payload: form }),
    resetOverlayForm: () => dispatch({ type: ACTIONS.RESET_OVERLAY_FORM }),
    setIsDragging: (dragging) => dispatch({ type: ACTIONS.SET_IS_DRAGGING, payload: dragging }),
    setDragOverlay: (overlay) => dispatch({ type: ACTIONS.SET_DRAG_OVERLAY, payload: overlay }),
    setShowSettings: (show) => dispatch({ type: ACTIONS.SET_SHOW_SETTINGS, payload: show }),
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error })
  }, []);

  return (
    <StreamContext.Provider value={{ state, actions }}>
      {children}
    </StreamContext.Provider>
  );
};

// Custom hook
export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
};