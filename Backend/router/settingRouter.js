const express = require('express');
const settingRouter = express.Router();
const {
  getSettings,
  updateSettings
} = require('../Controllers/Settingcontroller');

/**
 * @route   GET /api/settings
 * @desc    Get application settings
 * @access  Public
 */
settingRouter.get('/api/settings', getSettings);

/**
 * @route   PUT /api/settings
 * @desc    Update application settings
 * @access  Public
 */
settingRouter.put('/api/settings', updateSettings);

module.exports = settingRouter;