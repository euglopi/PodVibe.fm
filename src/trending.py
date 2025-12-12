"""
Trending Podcasts API - Updated to use YouTube Data API
More reliable than Gemini Search for finding trending videos
"""

from flask import jsonify
import requests
import os
from datetime import datetime, timedelta, timezone
import re
from typing import Optional, Dict, List, Any


_ISO8601_DURATION_RE = re.compile(
    r"^PT"
    r"(?:(?P<hours>\d+)H)?"
    r"(?:(?P<minutes>\d+)M)?"
    r"(?:(?P<seconds>\d+)S)?"
    r"$"
)


def _parse_duration_seconds(iso_duration: str) -> int:
    """
    Parse YouTube ISO8601 duration (e.g., PT1H2M3S) into seconds.
    Returns 0 if parsing fails.
    """
    if not iso_duration:
        return 0
    m = _ISO8601_DURATION_RE.match(iso_duration)
    if not m:
        return 0
    hours = int(m.group("hours") or 0)
    minutes = int(m.group("minutes") or 0)
    seconds = int(m.group("seconds") or 0)
    return hours * 3600 + minutes * 60 + seconds


def _parse_published_at(published_at: str) -> Optional[datetime]:
    # YouTube returns RFC3339 like "2025-12-12T10:30:00Z"
    try:
        if not published_at:
            return None
        if published_at.endswith("Z"):
            return datetime.fromisoformat(published_at.replace("Z", "+00:00"))
        return datetime.fromisoformat(published_at)
    except Exception:
        return None


def _is_english(snippet: dict) -> bool:
    """
    Best-effort check that the video is English.
    Uses snippet.defaultAudioLanguage / snippet.defaultLanguage when available.
    """
    lang = (snippet or {}).get("defaultAudioLanguage") or (snippet or {}).get("defaultLanguage") or ""
    lang = (lang or "").lower()
    return lang.startswith("en")


def _is_podcast_tagged(snippet: dict) -> bool:
    """
    Best-effort check that the video is tagged as a podcast.
    - Prefer a dedicated category id if present (YouTube has a 'Podcasts' category in some locales)
    - Otherwise fallback to tags/title/description containing 'podcast'
    """
    if not snippet:
        return False

    # Some YouTube environments use categoryId=43 for Podcasts; keep as a hint, not a guarantee.
    if str(snippet.get("categoryId", "")) == "43":
        return True

    haystack = f"{snippet.get('title','')} {snippet.get('description','')}".lower()
    if "podcast" in haystack or "#podcast" in haystack or "#podcasts" in haystack:
        return True

    tags = snippet.get("tags") or []
    for t in tags:
        if "podcast" in str(t).lower():
            return True
    return False


def _fetch_video_details(video_ids: List[str], api_key: str) -> Dict[str, Dict[str, Any]]:
    """
    Fetch contentDetails/snippet for given video ids.
    Returns a map: videoId -> item
    """
    if not video_ids:
        return {}

    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet,contentDetails",
        "id": ",".join(video_ids),
        "key": api_key,
        # "hl" could be set, but not required
    }
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()

    out: Dict[str, Dict[str, Any]] = {}
    for item in data.get("items", []):
        out[item.get("id")] = item
    return out

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
        # Only show recently uploaded: last 14 days
        published_after = (datetime.now(timezone.utc) - timedelta(days=14)).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        url = "https://www.googleapis.com/youtube/v3/search"
        # Fetch more than needed so we can filter down to strict constraints:
        # - uploaded within 2 weeks (publishedAfter)
        # - English (best-effort)
        # - tagged as podcast (best-effort)
        # - at least 1 hour (requires videos.list contentDetails.duration)
        search_max = max(15, max_results * 8)
        params = {
            'part': 'snippet',
            'q': f'{query} podcast',
            'type': 'video',
            'order': 'viewCount',  # Most viewed
            'publishedAfter': published_after,
            'maxResults': search_max,
            'key': api_key,
            'videoDuration': 'long',  # > 20 minutes (we'll further filter to >= 60 mins)
            'relevanceLanguage': 'en'
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        search_items = data.get("items", [])
        video_ids = [it.get("id", {}).get("videoId") for it in search_items if it.get("id", {}).get("videoId")]
        details_map = _fetch_video_details(video_ids, api_key)

        two_weeks_ago = datetime.now(timezone.utc) - timedelta(days=14)
        filtered = []

        for it in search_items:
            video_id = it.get("id", {}).get("videoId")
            if not video_id:
                continue

            details = details_map.get(video_id) or {}
            snippet = details.get("snippet") or it.get("snippet") or {}
            content = details.get("contentDetails") or {}

            # Constraints
            published_at = _parse_published_at(snippet.get("publishedAt"))
            if not published_at or published_at < two_weeks_ago:
                continue

            if not _is_english(snippet):
                continue

            if not _is_podcast_tagged(snippet):
                continue

            duration_seconds = _parse_duration_seconds(content.get("duration"))
            if duration_seconds < 3600:
                continue

            thumb = (snippet.get("thumbnails") or {}).get("high") or (snippet.get("thumbnails") or {}).get("default") or {}
            filtered.append({
                "title": snippet.get("title", ""),
                "channel": snippet.get("channelTitle", ""),
                "video_id": video_id,
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "thumbnail": thumb.get("url", ""),
                # Keep description for now; UI may ignore it in compact cards.
                "description": (snippet.get("description", "")[:150] + "...") if len(snippet.get("description", "")) > 150 else snippet.get("description", ""),
                # Extra metadata (future use / debugging)
                "publishedAt": snippet.get("publishedAt"),
                "durationSeconds": duration_seconds,
                "defaultAudioLanguage": snippet.get("defaultAudioLanguage") or snippet.get("defaultLanguage"),
            })

            if len(filtered) >= max_results:
                break

        return filtered
        
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
                'description': 'Podcast episode: Deep dive into the latest AI developments and what GPT-5 might bring to the table.',
                # match strict filters (best-effort demo)
                'publishedAt': (datetime.now(timezone.utc) - timedelta(days=3)).isoformat(),
                'durationSeconds': 3900,
                'defaultAudioLanguage': 'en'
            },
            {
                'title': 'AI Safety: Why It Matters Now More Than Ever',
                'channel': 'Tech Future Podcast',
                'video_id': 'oHg5SJYRHA0',
                'url': 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
                'thumbnail': 'https://img.youtube.com/vi/oHg5SJYRHA0/hqdefault.jpg',
                'description': 'Podcast episode: Exploring the critical importance of AI safety research and alignment.',
                'publishedAt': (datetime.now(timezone.utc) - timedelta(days=5)).isoformat(),
                'durationSeconds': 4200,
                'defaultAudioLanguage': 'en'
            },
            {
                'title': 'Machine Learning Breakthroughs in 2024',
                'channel': 'ML Weekly',
                'video_id': 'jNQXAC9IVRw',
                'url': 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
                'thumbnail': 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg',
                'description': 'Podcast episode: A roundup of the most significant machine learning breakthroughs this year.',
                'publishedAt': (datetime.now(timezone.utc) - timedelta(days=9)).isoformat(),
                'durationSeconds': 3600,
                'defaultAudioLanguage': 'en'
            }
        ],
        "Tech News": [
            {
                'title': 'Apple Vision Pro: 6 Months Later',
                'channel': 'Tech Review Daily',
                'video_id': 'yPYZpwSpKmA',
                'url': 'https://www.youtube.com/watch?v=yPYZpwSpKmA',
                'thumbnail': 'https://img.youtube.com/vi/yPYZpwSpKmA/hqdefault.jpg',
                'description': 'Podcast episode: A comprehensive review after using Vision Pro for six months in real-world scenarios.',
                'publishedAt': (datetime.now(timezone.utc) - timedelta(days=2)).isoformat(),
                'durationSeconds': 3700,
                'defaultAudioLanguage': 'en'
            },
            {
                'title': 'The State of Tech in 2025',
                'channel': 'Tech Trends',
                'video_id': '9bZkp7q19f0',
                'url': 'https://www.youtube.com/watch?v=9bZkp7q19f0',
                'thumbnail': 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg',
                'description': 'Podcast episode: Breaking down the biggest tech trends and what to expect in the coming year.',
                'publishedAt': (datetime.now(timezone.utc) - timedelta(days=7)).isoformat(),
                'durationSeconds': 5400,
                'defaultAudioLanguage': 'en'
            },
            {
                'title': 'Silicon Valley Startup Scene Update',
                'channel': 'Startup Stories',
                'video_id': 'pRpeEdMmmQ0',
                'url': 'https://www.youtube.com/watch?v=pRpeEdMmmQ0',
                'thumbnail': 'https://img.youtube.com/vi/pRpeEdMmmQ0/hqdefault.jpg',
                'description': 'Podcast episode: Latest news from Silicon Valley startups and venture capital trends.',
                'publishedAt': (datetime.now(timezone.utc) - timedelta(days=12)).isoformat(),
                'durationSeconds': 4000,
                'defaultAudioLanguage': 'en'
            }
        ],
        "Movies": [
            {
                'title': 'Top Movies of 2024: A Retrospective',
                'channel': 'Cinema Podcast',
                'video_id': 'kJQP7kiw5Fk',
                'url': 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
                'thumbnail': 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
                'description': 'Podcast episode: Reviewing the best films of 2024 and what made them special.',
                'publishedAt': (datetime.now(timezone.utc) - timedelta(days=4)).isoformat(),
                'durationSeconds': 3900,
                'defaultAudioLanguage': 'en'
            },
            {
                'title': 'Oscars 2025: Predictions and Analysis',
                'channel': 'Film Critics Roundtable',
                'video_id': 'lDK9QqIzhwk',
                'url': 'https://www.youtube.com/watch?v=lDK9QqIzhwk',
                'thumbnail': 'https://img.youtube.com/vi/lDK9QqIzhwk/hqdefault.jpg',
                'description': 'Podcast episode: Expert predictions for this year\'s Academy Awards and dark horse candidates.',
                'publishedAt': (datetime.now(timezone.utc) - timedelta(days=10)).isoformat(),
                'durationSeconds': 4200,
                'defaultAudioLanguage': 'en'
            },
            {
                'title': 'Behind the Scenes: Modern Filmmaking',
                'channel': 'Movie Insider',
                'video_id': 'CevxZvSJLk8',
                'url': 'https://www.youtube.com/watch?v=CevxZvSJLk8',
                'thumbnail': 'https://img.youtube.com/vi/CevxZvSJLk8/hqdefault.jpg',
                'description': 'Podcast episode: How technology is changing the way movies are made in Hollywood.',
                'publishedAt': (datetime.now(timezone.utc) - timedelta(days=1)).isoformat(),
                'durationSeconds': 3900,
                'defaultAudioLanguage': 'en'
            }
        ],
        "Politics": [
            {
                'title': '2024 Election Analysis: What It Means',
                'channel': 'Political Roundtable',
                'video_id': 'kffacxfA7G4',
                'url': 'https://www.youtube.com/watch?v=kffacxfA7G4',
                'thumbnail': 'https://img.youtube.com/vi/kffacxfA7G4/hqdefault.jpg',
                'description': 'Podcast episode: Expert analysis of the election results and implications for policy.',
                'publishedAt': (datetime.now(timezone.utc) - timedelta(days=6)).isoformat(),
                'durationSeconds': 4100,
                'defaultAudioLanguage': 'en'
            },
            {
                'title': 'Understanding Modern Political Movements',
                'channel': 'Policy Podcast',
                'video_id': 'fJ9rUzIMcZQ',
                'url': 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
                'thumbnail': 'https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
                'description': 'Podcast episode: Deep dive into the grassroots movements shaping politics today.',
                'publishedAt': (datetime.now(timezone.utc) - timedelta(days=8)).isoformat(),
                'durationSeconds': 3605,
                'defaultAudioLanguage': 'en'
            },
            {
                'title': 'Climate Policy: Progress and Challenges',
                'channel': 'The Policy Show',
                'video_id': 'WPni755-Krg',
                'url': 'https://www.youtube.com/watch?v=WPni755-Krg',
                'thumbnail': 'https://img.youtube.com/vi/WPni755-Krg/hqdefault.jpg',
                'description': 'Podcast episode: Examining recent climate legislation and what still needs to be done.',
                'publishedAt': (datetime.now(timezone.utc) - timedelta(days=11)).isoformat(),
                'durationSeconds': 4800,
                'defaultAudioLanguage': 'en'
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
