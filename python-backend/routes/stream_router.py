from flask import Blueprint
from controllers.stream_controller import stream_video

# Create blueprint
stream_bp = Blueprint('stream', __name__)

@stream_bp.route('/api/stream', methods=['GET'])
def stream():
    """
    GET /api/stream?url=<stream_url>
    Stream video from URL using FFmpeg
    Query params:
        - url: Video stream URL (RTSP, HTTP, HTTPS, .mp4, .m3u8, etc.)
    """
    return stream_video()