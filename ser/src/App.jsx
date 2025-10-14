import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

export default function LivestreamApp() {
  const [rtspUrl, setRtspUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [overlays, setOverlays] = useState([]);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [showOverlayForm, setShowOverlayForm] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  const videoRef = useRef(null);
  const [overlayForm, setOverlayForm] = useState({
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
  });

  useEffect(() => {
    fetchOverlays();
  }, []);

  const fetchOverlays = async () => {
    try {
      const res = await fetch(`${API_BASE}/overlays`);
      const data = await res.json();
      setOverlays(data);
    } catch (err) {
      console.error('Error fetching overlays:', err);
    }
  };

  const handleStreamStart = () => {
    if (!rtspUrl) {
      alert('Please enter an RTSP URL');
      return;
    }
    // In production, this would convert RTSP to HLS/WebRTC
    // For demo, we'll use a placeholder HLS stream
    setStreamUrl(`${API_BASE}/stream?url=${encodeURIComponent(rtspUrl)}`);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const createOverlay = async () => {
    try {
      const res = await fetch(`${API_BASE}/overlays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(overlayForm)
      });
      const data = await res.json();
      setOverlays([...overlays, data]);
      setShowOverlayForm(false);
      resetOverlayForm();
    } catch (err) {
      console.error('Error creating overlay:', err);
    }
  };

  const updateOverlay = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/overlays/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(overlayForm)
      });
      const data = await res.json();
      setOverlays(overlays.map(o => o._id === id ? data : o));
      setSelectedOverlay(null);
      resetOverlayForm();
    } catch (err) {
      console.error('Error updating overlay:', err);
    }
  };

  const deleteOverlay = async (id) => {
    try {
      await fetch(`${API_BASE}/overlays/${id}`, { method: 'DELETE' });
      setOverlays(overlays.filter(o => o._id !== id));
    } catch (err) {
      console.error('Error deleting overlay:', err);
    }
  };

  const resetOverlayForm = () => {
    setOverlayForm({
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
    });
  };

  const editOverlay = (overlay) => {
    setOverlayForm(overlay);
    setSelectedOverlay(overlay._id);
    setShowOverlayForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            RTSP Livestream Player
          </h1>
          <p className="text-gray-300 text-lg">Stream, customize, and manage your live video overlays</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20">
              <div className="relative aspect-video bg-black">
                {!streamUrl ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Play className="w-24 h-24 text-purple-400 mb-6" />
                    <p className="text-gray-400 text-xl mb-8">Enter RTSP URL to start streaming</p>
                    <div className="w-full max-w-md px-8">
                      <input
                        type="text"
                        placeholder="rtsp://example.com/stream"
                        value={rtspUrl}
                        onChange={(e) => setRtspUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg mb-4 border border-purple-500/30 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        onClick={handleStreamStart}
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        Start Streaming
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full"
                      src={streamUrl}
                      autoPlay
                    />
                    {overlays.map((overlay, idx) => (
                      <div
                        key={overlay._id || idx}
                        style={{
                          position: 'absolute',
                          left: `${overlay.position.x}px`,
                          top: `${overlay.position.y}px`,
                          width: `${overlay.size.width}px`,
                          height: `${overlay.size.height}px`,
                          color: overlay.style.color,
                          fontSize: `${overlay.style.fontSize}px`,
                          fontWeight: overlay.style.fontWeight,
                          backgroundColor: overlay.style.backgroundColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                          padding: '8px'
                        }}
                      >
                        {overlay.type === 'text' ? overlay.content : <img src={overlay.content} alt="overlay" className="w-full h-full object-contain" />}
                      </div>
                    ))}
                  </>
                )}
              </div>

              {streamUrl && (
                <div className="p-4 bg-slate-900/50 border-t border-purple-500/20">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="p-2 hover:bg-slate-700 rounded-lg transition">
                      {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                    </button>
                    <button onClick={toggleMute} className="p-2 hover:bg-slate-700 rounded-lg transition">
                      {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="flex-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Overlay Management Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 border border-purple-500/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Overlays</h2>
                <button
                  onClick={() => setShowOverlayForm(!showOverlayForm)}
                  className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>

              {showOverlayForm && (
                <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-purple-500/20">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {selectedOverlay ? 'Edit Overlay' : 'New Overlay'}
                    </h3>
                    <button onClick={() => { setShowOverlayForm(false); setSelectedOverlay(null); resetOverlayForm(); }}>
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <select
                      value={overlayForm.type}
                      onChange={(e) => setOverlayForm({ ...overlayForm, type: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-purple-500/30"
                    >
                      <option value="text">Text</option>
                      <option value="image">Image URL</option>
                    </select>

                    <input
                      type="text"
                      placeholder={overlayForm.type === 'text' ? 'Enter text' : 'Enter image URL'}
                      value={overlayForm.content}
                      onChange={(e) => setOverlayForm({ ...overlayForm, content: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-purple-500/30"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="X Position"
                        value={overlayForm.position.x}
                        onChange={(e) => setOverlayForm({ ...overlayForm, position: { ...overlayForm.position, x: parseInt(e.target.value) } })}
                        className="px-3 py-2 bg-slate-700 text-white rounded-lg border border-purple-500/30"
                      />
                      <input
                        type="number"
                        placeholder="Y Position"
                        value={overlayForm.position.y}
                        onChange={(e) => setOverlayForm({ ...overlayForm, position: { ...overlayForm.position, y: parseInt(e.target.value) } })}
                        className="px-3 py-2 bg-slate-700 text-white rounded-lg border border-purple-500/30"
                      />
                    </div>

                    {overlayForm.type === 'text' && (
                      <>
                        <input
                          type="color"
                          value={overlayForm.style.color}
                          onChange={(e) => setOverlayForm({ ...overlayForm, style: { ...overlayForm.style, color: e.target.value } })}
                          className="w-full h-10 bg-slate-700 rounded-lg border border-purple-500/30"
                        />
                        <input
                          type="number"
                          placeholder="Font Size"
                          value={overlayForm.style.fontSize}
                          onChange={(e) => setOverlayForm({ ...overlayForm, style: { ...overlayForm.style, fontSize: parseInt(e.target.value) } })}
                          className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-purple-500/30"
                        />
                      </>
                    )}

                    <button
                      onClick={() => selectedOverlay ? updateOverlay(selectedOverlay) : createOverlay()}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {selectedOverlay ? 'Update' : 'Create'}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {overlays.map((overlay) => (
                  <div key={overlay._id} className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-sm font-semibold text-purple-400">{overlay.type.toUpperCase()}</span>
                        <p className="text-white truncate">{overlay.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editOverlay(overlay)} className="p-1 hover:bg-slate-700 rounded transition">
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button onClick={() => deleteOverlay(overlay._id)} className="p-1 hover:bg-slate-700 rounded transition">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Position: ({overlay.position.x}, {overlay.position.y})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}