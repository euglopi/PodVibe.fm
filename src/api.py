"""
Flask API Backend for PodVibe.fm
Connects React frontend with the Agentic AI system
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
from datetime import datetime

# Add src to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from youtube_summarizer import YouTubeSummarizer
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize the summarizer (lazy loading)
summarizer = None

def get_summarizer():
    """Lazy load the summarizer to avoid initialization errors"""
    global summarizer
    if summarizer is None:
        summarizer = YouTubeSummarizer()
    return summarizer


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/summarize', methods=['POST'])
def summarize_video():
    """
    Summarize a YouTube video

    Request JSON:
        {
            "url": "https://www.youtube.com/watch?v=..."
        }

    Response JSON:
        {
            "success": true,
            "video_id": "...",
            "summary": "...",
            "transcript_length": 12345,
            "segments": 123,
            "timestamp": "2025-12-12T10:30:00",
            "memory_log": [...]
        }
    """
    try:
        # Get URL from request
        data = request.get_json()
        url = data.get('url', '').strip()

        if not url:
            return jsonify({
                'success': False,
                'error': 'YouTube URL is required'
            }), 400

        # Validate URL format
        if 'youtube.com' not in url and 'youtu.be' not in url:
            return jsonify({
                'success': False,
                'error': 'Invalid YouTube URL'
            }), 400

        # Process the video using the agentic AI system
        print(f"🎬 Processing YouTube URL: {url}")
        summ = get_summarizer()
        result = summ.process_youtube_url(url)

        # Get memory log
        memory_log = summ.get_memory_log()

        # Format response
        response = {
            'success': True,
            'video_id': result.get('video_id', ''),
            'summary': result.get('summary', ''),
            'keywords': result.get('keywords', []),
            'transcript_length': result.get('transcript_length', 0),
            'segments': result.get('segments', 0),
            'timestamp': datetime.now().isoformat(),
            'memory_log': memory_log
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"❌ Error processing request: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/models', methods=['GET'])
def list_models():
    """List available Gemini models"""
    try:
        import google.generativeai as genai

        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        models = genai.list_models()

        model_list = [
            {
                'name': m.name,
                'display_name': m.display_name,
                'description': m.description
            }
            for m in models
            if 'generateContent' in m.supported_generation_methods
        ]

        return jsonify({
            'success': True,
            'models': model_list
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/trending', methods=['GET'])
def get_trending():
    """Get trending videos by category using YouTube API or sample data"""
    from trending import get_trending_podcasts_route
    return get_trending_podcasts_route()


if __name__ == '__main__':
    print("🚀 Starting PodVibe.fm API...")
    print("📡 React frontend should connect to: http://localhost:8000")
    print("🔧 API endpoints available:")
    print("   - GET  /api/health     - Health check")
    print("   - POST /api/summarize  - Summarize YouTube video")
    print("   - GET  /api/models     - List available models")
    print("   - GET  /api/trending   - Get trending videos")
    print("\n" + "="*80)

    # Check for API keys
    if not os.getenv('GEMINI_API_KEY'):
        print("⚠️  WARNING: GEMINI_API_KEY not found in environment!")
        print("   Make sure your .env file is configured correctly.")
    else:
        print("✅ GEMINI_API_KEY found")

    if not os.getenv('YOUTUBE_API_KEY'):
        print("ℹ️  YOUTUBE_API_KEY not found - using sample data for trending")
        print("   To get real trending videos, add YOUTUBE_API_KEY to .env")
        print("   Run: ./setup_youtube_api.sh")
    else:
        print("✅ YOUTUBE_API_KEY found - using real YouTube data!")

    print("="*80 + "\n")

    app.run(host='0.0.0.0', port=8000, debug=True)
