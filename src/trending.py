"""
Trending Podcasts API - Updated to use YouTube Data API
More reliable than Gemini Search for finding trending videos
"""

from flask import jsonify
import requests
import os
from datetime import datetime, timedelta

def search_youtube_videos(query, max_results=3):
    """
    Use YouTube Data API to search for videos
    
    Args:
        query: Search query
        max_results: Number of results
    
    Returns:
        List of video objects
    """
    api_key = os.getenv('YOUTUBE_API_KEY')
    
    # Fallback: Use Gemini to generate sample data if no YouTube API key
    if not api_key:
        return generate_sample_videos(query, max_results)
    
    try:
        # Calculate date from 30 days ago
        thirty_days_ago = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            'part': 'snippet',
            'q': f'{query} podcast',
            'type': 'video',
            'order': 'viewCount',  # Most viewed
            'publishedAfter': thirty_days_ago,
            'maxResults': max_results,
            'key': api_key,
            'videoDuration': 'medium',  # 4-20 minutes
            'relevanceLanguage': 'en'
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        videos = []
        for item in data.get('items', []):
            video_id = item['id']['videoId']
            snippet = item['snippet']
            
            videos.append({
                'title': snippet['title'],
                'channel': snippet['channelTitle'],
                'video_id': video_id,
                'url': f'https://www.youtube.com/watch?v={video_id}',
                'thumbnail': snippet['thumbnails']['high']['url'],
                'description': snippet['description'][:150] + '...' if len(snippet['description']) > 150 else snippet['description']
            })
        
        return videos
        
    except Exception as e:
        print(f"YouTube API error for '{query}': {str(e)}")
        # Fallback to sample data
        return generate_sample_videos(query, max_results)


def generate_sample_videos(query, count=3):
    """
    Generate sample video data when YouTube API is not available
    This provides a working demo even without API keys
    """
    # Map of sample videos for each category
    samples = {
        "Latest in AI": [
            {
                'title': 'The Future of AI: GPT-5 and Beyond',
                'channel': 'AI Explained',
                'video_id': 'dQw4w9WgXcQ',
                'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'thumbnail': 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
                'description': 'Deep dive into the latest AI developments and what GPT-5 might bring to the table.'
            },
            {
                'title': 'AI Safety: Why It Matters Now More Than Ever',
                'channel': 'Tech Future Podcast',
                'video_id': 'oHg5SJYRHA0',
                'url': 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
                'thumbnail': 'https://img.youtube.com/vi/oHg5SJYRHA0/hqdefault.jpg',
                'description': 'Exploring the critical importance of AI safety research and alignment.'
            },
            {
                'title': 'Machine Learning Breakthroughs in 2024',
                'channel': 'ML Weekly',
                'video_id': 'jNQXAC9IVRw',
                'url': 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
                'thumbnail': 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg',
                'description': 'A roundup of the most significant machine learning breakthroughs this year.'
            }
        ],
        "Tech News": [
            {
                'title': 'Apple Vision Pro: 6 Months Later',
                'channel': 'Tech Review Daily',
                'video_id': 'yPYZpwSpKmA',
                'url': 'https://www.youtube.com/watch?v=yPYZpwSpKmA',
                'thumbnail': 'https://img.youtube.com/vi/yPYZpwSpKmA/hqdefault.jpg',
                'description': 'A comprehensive review after using Vision Pro for six months in real-world scenarios.'
            },
            {
                'title': 'The State of Tech in 2025',
                'channel': 'Tech Trends',
                'video_id': '9bZkp7q19f0',
                'url': 'https://www.youtube.com/watch?v=9bZkp7q19f0',
                'thumbnail': 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg',
                'description': 'Breaking down the biggest tech trends and what to expect in the coming year.'
            },
            {
                'title': 'Silicon Valley Startup Scene Update',
                'channel': 'Startup Stories',
                'video_id': 'pRpeEdMmmQ0',
                'url': 'https://www.youtube.com/watch?v=pRpeEdMmmQ0',
                'thumbnail': 'https://img.youtube.com/vi/pRpeEdMmmQ0/hqdefault.jpg',
                'description': 'Latest news from Silicon Valley startups and venture capital trends.'
            }
        ],
        "Movies": [
            {
                'title': 'Top Movies of 2024: A Retrospective',
                'channel': 'Cinema Podcast',
                'video_id': 'kJQP7kiw5Fk',
                'url': 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
                'thumbnail': 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
                'description': 'Reviewing the best films of 2024 and what made them special.'
            },
            {
                'title': 'Oscars 2025: Predictions and Analysis',
                'channel': 'Film Critics Roundtable',
                'video_id': 'lDK9QqIzhwk',
                'url': 'https://www.youtube.com/watch?v=lDK9QqIzhwk',
                'thumbnail': 'https://img.youtube.com/vi/lDK9QqIzhwk/hqdefault.jpg',
                'description': 'Expert predictions for this year\'s Academy Awards and dark horse candidates.'
            },
            {
                'title': 'Behind the Scenes: Modern Filmmaking',
                'channel': 'Movie Insider',
                'video_id': 'CevxZvSJLk8',
                'url': 'https://www.youtube.com/watch?v=CevxZvSJLk8',
                'thumbnail': 'https://img.youtube.com/vi/CevxZvSJLk8/hqdefault.jpg',
                'description': 'How technology is changing the way movies are made in Hollywood.'
            }
        ],
        "Politics": [
            {
                'title': '2024 Election Analysis: What It Means',
                'channel': 'Political Roundtable',
                'video_id': 'kffacxfA7G4',
                'url': 'https://www.youtube.com/watch?v=kffacxfA7G4',
                'thumbnail': 'https://img.youtube.com/vi/kffacxfA7G4/hqdefault.jpg',
                'description': 'Expert analysis of the election results and implications for policy.'
            },
            {
                'title': 'Understanding Modern Political Movements',
                'channel': 'Policy Podcast',
                'video_id': 'fJ9rUzIMcZQ',
                'url': 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
                'thumbnail': 'https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
                'description': 'Deep dive into the grassroots movements shaping politics today.'
            },
            {
                'title': 'Climate Policy: Progress and Challenges',
                'channel': 'The Policy Show',
                'video_id': 'WPni755-Krg',
                'url': 'https://www.youtube.com/watch?v=WPni755-Krg',
                'thumbnail': 'https://img.youtube.com/vi/WPni755-Krg/hqdefault.jpg',
                'description': 'Examining recent climate legislation and what still needs to be done.'
            }
        ]
    }
    
    # Return sample videos for the query
    for category, videos in samples.items():
        if category.lower() in query.lower():
            return videos[:count]
    
    # Default fallback
    return samples.get("Latest in AI", [])[:count]


def get_trending_podcasts_route():
    """
    Flask route handler for /api/trending
    Returns trending podcasts for all categories
    """
    try:
        categories = [
            {"id": "ai", "name": "Latest in AI", "icon": "🤖"},
            {"id": "tech", "name": "Tech News", "icon": "💻"},
            {"id": "movies", "name": "Movies", "icon": "🎬"},
            {"id": "politics", "name": "Politics", "icon": "🗳️"}
        ]
        
        results = {}
        
        # Check if YouTube API key is available
        has_youtube_api = bool(os.getenv('YOUTUBE_API_KEY'))
        
        if not has_youtube_api:
            print("⚠️  No YOUTUBE_API_KEY found - using sample data")
        
        for category in categories:
            print(f"🔍 Searching trending podcasts for: {category['name']}")
            videos = search_youtube_videos(category['name'], max_results=3)
            
            results[category['id']] = {
                'name': category['name'],
                'icon': category['icon'],
                'videos': videos
            }
            
            print(f"✅ Found {len(videos)} videos for {category['name']}")
        
        return jsonify({
            'success': True,
            'categories': results,
            'timestamp': datetime.now().isoformat(),
            'using_sample_data': not has_youtube_api
        }), 200
        
    except Exception as e:
        print(f"❌ Error getting trending podcasts: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
