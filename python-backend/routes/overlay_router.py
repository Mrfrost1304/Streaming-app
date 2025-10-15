from flask import Blueprint
from controllers.overlay_controller import (
    get_all_overlays,
    get_overlay_by_id,
    create_overlay,
    update_overlay,
    delete_overlay
)

# Create blueprint
overlay_bp = Blueprint('overlay', __name__)

@overlay_bp.route('/', methods=['GET'])
def get_overlays():
    """
    GET /api/overlays
    Get all overlays
    """
    return get_all_overlays()

@overlay_bp.route('/<overlay_id>', methods=['GET'])
def get_overlay(overlay_id):
    """
    GET /api/overlays/:id
    Get single overlay by ID
    """
    return get_overlay_by_id(overlay_id)

@overlay_bp.route('/', methods=['POST'])
def create():
    """
    POST /api/overlays
    Create new overlay
    Body: { type, content, position, size, style }
    """
    return create_overlay()

@overlay_bp.route('/<overlay_id>', methods=['PUT'])
def update(overlay_id):
    """
    PUT /api/overlays/:id
    Update overlay
    """
    return update_overlay(overlay_id)

@overlay_bp.route('/<overlay_id>', methods=['DELETE'])
def delete(overlay_id):
    """
    DELETE /api/overlays/:id
    Delete overlay
    """
    return delete_overlay(overlay_id)