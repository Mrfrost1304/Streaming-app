from flask import Blueprint
from controllers.setting_controller import get_settings, update_settings

# Create blueprint
setting_bp = Blueprint('setting', __name__)

@setting_bp.route('/', methods=['GET'])
def get():
    """
    GET /api/settings
    Get application settings
    """
    return get_settings()

@setting_bp.route('/', methods=['PUT'])
def update():
    """
    PUT /api/settings
    Update application settings
    """
    return update_settings()