const mongoose = require('mongoose');

const overlaySchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['text', 'image'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    position: {
      x: { type: Number, default: 50 },
      y: { type: Number, default: 50 }
    },
    size: {
      width: { type: Number, default: 200 },
      height: { type: Number, default: 50 }
    },
    style: {
      color: { type: String, default: '#ffffff' },
      fontSize: { type: Number, default: 24 },
      fontWeight: { type: String, default: 'bold' },
      backgroundColor: { type: String, default: 'rgba(0,0,0,0.5)' }
    }
  }, {
    timestamps: true
  });
  
const Overlay = mongoose.model('Overlay', overlaySchema);

module.exports = Overlay;