from flask import Response, request, jsonify
import subprocess
import signal
import sys

def stream_video():
    """
    Stream video from URL using FFmpeg
    Converts RTSP/HTTP/HTTPS to MP4 stream
    """
    stream_url = request.args.get('url')
    
    if not stream_url:
        return jsonify({'error': 'Stream URL is required'}), 400
    
    def generate():
        """Generator function for streaming video"""
        ffmpeg_cmd = [
            'ffmpeg',
            '-i', stream_url,
            '-c:v', 'libx264',           # H.264 video codec
            '-c:a', 'aac',               # AAC audio codec
            '-f', 'mp4',                 # MP4 format
            '-movflags', 'frag_keyframe+empty_moov+default_base_moof',  # Enable streaming
            '-preset', 'ultrafast',      # Fast encoding
            '-tune', 'zerolatency',      # Low latency
            '-crf', '23',                # Quality setting
            '-maxrate', '1000k',         # Max bitrate
            '-bufsize', '2000k',         # Buffer size
            'pipe:1'                     # Output to stdout
        ]
        
        process = None
        
        try:
            # Start FFmpeg process
            process = subprocess.Popen(
                ffmpeg_cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                bufsize=10**8
            )
            
            # Stream data chunks
            while True:
                chunk = process.stdout.read(8192)
                if not chunk:
                    break
                yield chunk
                
        except GeneratorExit:
            # Client disconnected
            if process:
                process.send_signal(signal.SIGINT)
                process.wait()
        except Exception as e:
            print(f'FFmpeg error: {e}', file=sys.stderr)
            if process:
                process.kill()
                process.wait()
        finally:
            if process and process.poll() is None:
                process.kill()
                process.wait()
    
    # Return response with proper headers
    return Response(
        generate(),
        mimetype='video/mp4',
        headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Range',
            'Cache-Control': 'no-cache',
            'Accept-Ranges': 'bytes'
        }
    )