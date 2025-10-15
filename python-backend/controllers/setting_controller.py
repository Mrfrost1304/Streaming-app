from flask import jsonify, request
from models.setting import Settings

def get_settings():
    """
    Get application settings
    """
    try:
        settings = Settings.get_settings()
        settings = Settings.serialize(settings)
        return jsonify(settings), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def update_settings():
    """
    Update application settings
    """
    try:
        data = request.get_json()
        
        settings = Settings.update_settings(data)
        settings = Settings.serialize(settings)
        
        return jsonify(settings), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500