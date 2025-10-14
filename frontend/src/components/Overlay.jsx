import React from 'react';
import { Move } from 'lucide-react';

const Overlay = ({ overlay, isSelected, isDragging, onMouseDown, onClick }) => {
  return (
    <div
      className={`absolute cursor-move transition-all duration-200 ${
        isSelected ? 'ring-2 ring-purple-400 ring-opacity-50' : ''
      } ${isDragging ? 'z-50 scale-105' : 'z-10'}`}
      style={{
        left: `${overlay.position.x}px`,
        top: `${overlay.position.y}px`,
        width: `${overlay.size.width}px`,
        height: `${overlay.size.height}px`,
        color: overlay.style.color,
        fontSize: `${overlay.style.fontSize}px`,
        fontWeight: overlay.style.fontWeight,
        backgroundColor: overlay.style.backgroundColor,
        borderRadius: '12px',
        padding: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
      }}
      onMouseDown={(e) => onMouseDown(e, overlay)}
      onClick={() => onClick(overlay._id)}
    >
      <div className="flex items-center justify-center h-full">
        {overlay.type === 'text' ? (
          <span className="text-center">{overlay.content}</span>
        ) : (
          <img src={overlay.content} alt="overlay" className="w-full h-full object-contain rounded-lg" />
        )}
      </div>
      <div className="absolute top-1 right-1 opacity-50">
        <Move className="w-3 h-3" />
      </div>
    </div>
  );
};

export default Overlay;