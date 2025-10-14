import React from 'react';
import { Save, X } from 'lucide-react';
import { useStream } from '../context/StreamContext.jsx';
import { useStreamAPI } from '../hooks/useStreamAPI.jsx';

const OverlayForm = () => {
  const { state, actions } = useStream();
  const { createOverlay, updateOverlay } = useStreamAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!state.overlayForm.content.trim()) {
      alert('Please enter overlay content');
      return;
    }
    
    try {
      if (state.selectedOverlay) {
        await updateOverlay(state.selectedOverlay, state.overlayForm);
        actions.setSelectedOverlay(null);
      } else {
        await createOverlay(state.overlayForm);
      }
      actions.setShowOverlayForm(false);
      actions.resetOverlayForm();
    } catch (err) {
      alert('Failed to save overlay. Please try again.');
    }
  };

  const handleClose = () => {
    actions.setShowOverlayForm(false);
    actions.setSelectedOverlay(null);
    actions.resetOverlayForm();
  };

  return (
    <div className="mb-6 p-6 bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-purple-500/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">
          {state.selectedOverlay ? 'Edit Overlay' : 'Create Overlay'}
        </h3>
        <button 
          onClick={handleClose}
          className="p-2 hover:bg-slate-700 rounded-lg transition"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
          <select
            value={state.overlayForm.type}
            onChange={(e) => actions.setOverlayForm({ type: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700/80 text-white rounded-xl border border-purple-500/30 focus:outline-none focus:border-purple-500"
          >
            <option value="text">Text Overlay</option>
            <option value="image">Image Overlay</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {state.overlayForm.type === 'text' ? 'Text Content' : 'Image URL'}
          </label>
          <input
            type="text"
            placeholder={state.overlayForm.type === 'text' ? 'Enter your text here...' : 'https://example.com/image.jpg'}
            value={state.overlayForm.content}
            onChange={(e) => actions.setOverlayForm({ content: e.target.value })}
            className="w-full px-4 py-3 bg-slate-700/80 text-white rounded-xl border border-purple-500/30 focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">X Position</label>
            <input
              type="number"
              value={state.overlayForm.position.x}
              onChange={(e) => actions.setOverlayForm({ 
                position: { ...state.overlayForm.position, x: parseInt(e.target.value) || 0 } 
              })}
              className="w-full px-3 py-2 bg-slate-700/80 text-white rounded-lg border border-purple-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Y Position</label>
            <input
              type="number"
              value={state.overlayForm.position.y}
              onChange={(e) => actions.setOverlayForm({ 
                position: { ...state.overlayForm.position, y: parseInt(e.target.value) || 0 } 
              })}
              className="w-full px-3 py-2 bg-slate-700/80 text-white rounded-lg border border-purple-500/30"
            />
          </div>
        </div>

        {state.overlayForm.type === 'text' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Text Color</label>
              <input
                type="color"
                value={state.overlayForm.style.color}
                onChange={(e) => actions.setOverlayForm({ 
                  style: { ...state.overlayForm.style, color: e.target.value } 
                })}
                className="w-full h-12 bg-slate-700/80 rounded-xl border border-purple-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Font Size</label>
              <input
                type="number"
                placeholder="24"
                value={state.overlayForm.style.fontSize}
                onChange={(e) => actions.setOverlayForm({ 
                  style: { ...state.overlayForm.style, fontSize: parseInt(e.target.value) || 24 } 
                })}
                className="w-full px-4 py-3 bg-slate-700/80 text-white rounded-xl border border-purple-500/30"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
        >
          <Save className="w-5 h-5" />
          {state.selectedOverlay ? 'Update Overlay' : 'Create Overlay'}
        </button>
      </form>
    </div>
  );
};

export default OverlayForm;