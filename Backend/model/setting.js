const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    rtspUrl: {
      type: String,
      default: ''
    },
    streamQuality: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'high'
    },
    bufferSize: {
      type: Number,
      default: 1024
    }
  }, {
    timestamps: true
  });
  
const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;