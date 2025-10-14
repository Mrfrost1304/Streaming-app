const Settings = require('../model/setting');

/**
 * @desc    Get application settings
 * @access  Public
 */
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = new Settings({
        rtspUrl: '',
        streamQuality: 'high',
        bufferSize: 1024
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Update application settings
 * @access  Public
 */
const updateSettings = async (req, res) => {
  try {
    const { rtspUrl, streamQuality, bufferSize } = req.body;
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({
        rtspUrl,
        streamQuality,
        bufferSize
      });
    } else {
      if (rtspUrl !== undefined) settings.rtspUrl = rtspUrl;
      if (streamQuality !== undefined) settings.streamQuality = streamQuality;
      if (bufferSize !== undefined) settings.bufferSize = bufferSize;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};