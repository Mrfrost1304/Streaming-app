import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useStream } from '../context/StreamContext.jsx';
import { useStreamAPI } from '../hooks/useStreamAPI.jsx';

const OverlayList = () => {
  const { state, actions } = useStream();
  const { deleteOverlay } = useStreamAPI();

  const handleEdit = (overlay) => {
    actions.setOverlayForm(overlay);
    actions.setSelectedOverlay(overlay._id);
    actions.setShowOverlayForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this overlay?')) {
      try {
        await deleteOverlay(id);
      } catch (err) {
        alert('Failed to delete overlay. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {state.overlays.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400">No overlays yet</p>
          <p className="text-sm text-gray-500">Create your first overlay above</p>
        </div>
      ) : (
        state.overlays.map((overlay) => (
          <div 
            key={overlay._id} 
            className={`p-4 bg-slate-900/80 backdrop-blur-sm rounded-xl border transition-all ${
              state.selectedOverlay === overlay._id 
                ? 'border-purple-500/60 bg-purple-900/20' 
                : 'border-purple-500/20 hover:border-purple-500/40'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs font-semibold rounded-lg">
                    {overlay.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-white font-medium truncate">{overlay.content}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(overlay)} 
                  className="p-2 hover:bg-blue-600/20 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4 text-blue-400" />
                </button>
                <button 
                  onClick={() => handleDelete(overlay._id)} 
                  className="p-2 hover:bg-red-600/20 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Position: ({overlay.position.x}, {overlay.position.y})</span>
              <span className="text-purple-400">Drag to move</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OverlayList;