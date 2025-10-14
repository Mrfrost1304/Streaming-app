const Overlay = require('../model/overlays');

/**
 * @desc    Get all overlays
 * @access  Public
 */
const getAllOverlays = async (req, res) => {
  try {
    const overlays = await Overlay.find().sort({ createdAt: -1 });
    res.json(overlays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Get single overlay by ID
 * @access  Public
 */
const getOverlayById = async (req, res) => {
  try {
    const overlay = await Overlay.findById(req.params.id);
    
    if (!overlay) {
      return res.status(404).json({ error: 'Overlay not found' });
    }
    
    res.json(overlay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Create new overlay
 * @access  Public
 * @body    { type, content, position, size, style }
 */
const createOverlay = async (req, res) => {
  try {
    const { type, content, position, size, style } = req.body;
    
    // Validation
    if (!type || !content) {
      return res.status(400).json({ error: 'Type and content are required' });
    }
    
    if (!['text', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "text" or "image"' });
    }
    
    const overlay = new Overlay({
      type,
      content,
      position: position || { x: 50, y: 50 },
      size: size || { width: 200, height: 50 },
      style: style || {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }
    });
    
    const savedOverlay = await overlay.save();
    res.status(201).json(savedOverlay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Update overlay
 * @access  Public
 */
const updateOverlay = async (req, res) => {
  try {
    const { type, content, position, size, style } = req.body;
    
    const updateData = {};
    if (type) updateData.type = type;
    if (content) updateData.content = content;
    if (position) updateData.position = position;
    if (size) updateData.size = size;
    if (style) updateData.style = style;
    
    const overlay = await Overlay.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!overlay) {
      return res.status(404).json({ error: 'Overlay not found' });
    }
    
    res.json(overlay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Delete overlay
 * @access  Public
 */
const deleteOverlay = async (req, res) => {
  try {
    const overlay = await Overlay.findByIdAndDelete(req.params.id);
    
    if (!overlay) {
      return res.status(404).json({ error: 'Overlay not found' });
    }
    
    res.json({ message: 'Overlay deleted successfully', overlay });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOverlays,
  getOverlayById,
  createOverlay,
  updateOverlay,
  deleteOverlay
};