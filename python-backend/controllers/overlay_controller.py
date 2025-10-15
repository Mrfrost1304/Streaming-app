from flask import jsonify, request
from models.overlay import Overlay

def get_all_overlays():
    """
    Get all overlays
    """
    try:
        overlays = Overlay.find_all()
        overlays = [Overlay.serialize(o) for o in overlays]
        return jsonify(overlays), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_overlay_by_id(overlay_id):
    """
    Get single overlay by ID
    """
    try:
        overlay = Overlay.find_by_id(overlay_id)
        
        if not overlay:
            return jsonify({'error': 'Overlay not found'}), 404
        
        overlay = Overlay.serialize(overlay)
        return jsonify(overlay), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_overlay():
    """
    Create new overlay
    Body: { type, content, position, size, style }
    """
    try:
        data = request.get_json()
        
        # Validation
        if not data.get('type') or not data.get('content'):
            return jsonify({'error': 'Type and content are required'}), 400
        
        if data['type'] not in ['text', 'image']:
            return jsonify({'error': 'Type must be either "text" or "image"'}), 400
        
        overlay = Overlay.create(data)
        overlay = Overlay.serialize(overlay)
        
        return jsonify(overlay), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def update_overlay(overlay_id):
    """
    Update overlay
    """
    try:
        data = request.get_json()
        
        overlay = Overlay.update(overlay_id, data)
        
        if not overlay:
            return jsonify({'error': 'Overlay not found'}), 404
        
        overlay = Overlay.serialize(overlay)
        return jsonify(overlay), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def delete_overlay(overlay_id):
    """
    Delete overlay
    """
    try:
        overlay = Overlay.delete(overlay_id)
        
        if not overlay:
            return jsonify({'error': 'Overlay not found'}), 404
        
        overlay = Overlay.serialize(overlay)
        return jsonify({
            'message': 'Overlay deleted successfully',
            'overlay': overlay
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500