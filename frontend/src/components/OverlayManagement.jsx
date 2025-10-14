import React from 'react';
import { Plus } from 'lucide-react';
import { useStream } from '../context/StreamContext.jsx';
import OverlayForm from './OverlayForm.jsx';
import OverlayList from './OverlayList.jsx';

const OverlayManagement = () => {
  const { state, actions } = useStream();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-purple-500/30 h-fit">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Plus className="w-6 h-6 text-purple-400" />
          Overlays
        </h2>
        <button
          onClick={() => actions.setShowOverlayForm(!state.showOverlayForm)}
          className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {state.showOverlayForm && <OverlayForm />}
      <OverlayList />
    </div>
  );
};

export default OverlayManagement;