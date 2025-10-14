const express = require('express');
const overlayRouter = express.Router();
const {
  getAllOverlays,
  getOverlayById,
  createOverlay,
  updateOverlay,
  deleteOverlay
} = require('../Controllers/overlayscontroller');

/**
 * @route   GET /api/overlays
 * @desc    Get all overlays
 * @access  Public
 */
overlayRouter.get('/', getAllOverlays);

/**
 * @route   GET /api/overlays/:id
 * @desc    Get single overlay by ID
 * @access  Public
 */
overlayRouter.get('/:id', getOverlayById);

/**
 * @route   POST /api/overlays
 * @desc    Create new overlay
 * @access  Public
 * @body    { type, content, position, size, style }
 */
overlayRouter.post('/', createOverlay);

/**
 * @route   PUT /api/overlays/:id
 * @desc    Update overlay
 * @access  Public
 */
overlayRouter.put('/:id', updateOverlay);

/**
 * @route   DELETE /api/overlays/:id
 * @desc    Delete overlay
 * @access  Public
 */
overlayRouter.delete('/:id', deleteOverlay);

module.exports = overlayRouter;