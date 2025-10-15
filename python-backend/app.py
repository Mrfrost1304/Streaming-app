from flask import Flask, jsonify, request, Response, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables
load_dotenv()

# Import database configuration
from config.dbconfig import init_db

# Import routers
from routes.overlay_router import overlay_bp
from routes.setting_router import setting_bp
from routes.stream_router import stream_bp

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['PORT'] = int(os.getenv('PORT', 5000))
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/livestream_app')

# Initialize database
init_db(app)

# Middleware
CORS(app)

# Serve static files for HLS
@app.route('/hls/<path:filename>')
def serve_hls(filename):
    hls_dir = os.path.join(os.path.dirname(__file__), 'hls_output')
    return send_from_directory(hls_dir, filename)

# Register blueprints (routers)
app.register_blueprint(overlay_bp, url_prefix='/api/overlays')
app.register_blueprint(setting_bp, url_prefix='/api/settings')
app.register_blueprint(stream_bp)

# ===== HEALTH CHECK =====
@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    Returns server status and uptime
    """
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'uptime': os.times().elapsed if hasattr(os.times(), 'elapsed') else 0
    }), 200

# Error handling middleware
@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Something went wrong!'}), 500

# 404 handler
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Route not found'}), 404

if __name__ == '__main__':
    port = app.config['PORT']
    print(f'Server running on port {port}')
    print(f'API available at http://localhost:{port}/api')
    app.run(host='0.0.0.0', port=port, debug=True, threaded=True)