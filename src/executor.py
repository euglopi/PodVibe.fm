"""
Executor Module - Executes planned tasks using LLMs and external tools
Part of the PodVibe.fm Agentic AI System
"""

import os
import re
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs
from typing import Dict, Any
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Executor:
    """
    Executor component that handles actual task execution.
    Calls external tools (YouTube API, Gemini API) based on planner instructions.
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize the executor with API credentials
        
        Args:
            api_key: Google Gemini API key
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key required. Set GEMINI_API_KEY env variable or pass api_key")
        
        # Initialize Gemini with latest stable model
        genai.configure(api_key=self.api_key)
        self.gemini_model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Tool registry
        self.tools = {
            'url_parser': self.extract_video_id,
            'youtube_api': self.fetch_transcript,
            'gemini_api': self.generate_summary,
            'keyword_extractor': self.extract_keywords,
            'memory_store': self.store_result,
            'keyword_timestamp_finder': self.find_keyword_timestamp
        }
    
    def execute_task(self, task: Dict, context: Dict = None) -> Dict:
        """
        Execute a single task from the plan
        
        Args:
            task: Task dictionary with action and tool information
            context: Additional context needed for execution
            
        Returns:
            Execution result with status and data
        """
        action = task.get('action')
        tool_name = task.get('tool')
        
        try:
            tool = self.tools.get(tool_name)
            if not tool:
                raise ValueError(f"Tool '{tool_name}' not found")
            
            # Execute the tool with context
            result = tool(task, context or {})
            
            return {
                'status': 'success',
                'action': action,
                'result': result,
                'timestamp': datetime.now().isoformat()
            }
        
        except Exception as e:
            return {
                'status': 'failed',
                'action': action,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def extract_video_id(self, task: Dict, context: Dict) -> Dict:
        """
        Tool: Extract video ID from YouTube URL
        
        Args:
            task: Task details
            context: Contains 'url' key with YouTube URL
            
        Returns:
            Dictionary with video_id
        """
        url = context.get('url') or task.get('context', {}).get('url')
        if not url:
            raise ValueError("No URL provided")
        
        parsed_url = urlparse(url)
        
        # Handle different YouTube URL formats
        if parsed_url.hostname in ['www.youtube.com', 'youtube.com']:
            if parsed_url.path == '/watch':
                video_id = parse_qs(parsed_url.query)['v'][0]
            elif parsed_url.path.startswith('/embed/'):
                video_id = parsed_url.path.split('/')[2]
            elif parsed_url.path.startswith('/v/'):
                video_id = parsed_url.path.split('/')[2]
            else:
                raise ValueError(f"Unsupported YouTube URL format: {url}")
        elif parsed_url.hostname in ['youtu.be']:
            video_id = parsed_url.path[1:]
        else:
            raise ValueError(f"Not a valid YouTube URL: {url}")
        
        return {
            'video_id': video_id,
            'url': url,
            'tool_used': 'url_parser'
        }
    
    def fetch_transcript(self, task: Dict, context: Dict) -> Dict:
        """
        Tool: Fetch transcript from YouTube using YouTube Transcript API
        
        Args:
            task: Task details
            context: Contains 'video_id' from previous step
            
        Returns:
            Dictionary with transcript text
        """
        video_id = context.get('video_id')
        if not video_id:
            raise ValueError("No video_id provided")
        
        try:
            # Fetch transcript using external API
            # Create an instance and fetch transcript
            api = YouTubeTranscriptApi()
            transcript = api.fetch(video_id, languages=['en'])
            
            # Extract text from all snippets
            transcript_text = ' '.join([snippet.text for snippet in transcript.snippets])
            
            # Store transcript segments with timestamps for later use
            transcript_segments = [
                {
                    'text': snippet.text,
                    'start': snippet.start,
                    'duration': snippet.duration
                }
                for snippet in transcript.snippets
            ]
            
            return {
                'transcript': transcript_text,
                'transcript_segments': transcript_segments,  # Store segments with timestamps
                'length': len(transcript_text),
                'segments': len(transcript.snippets),
                'video_id': video_id,
                'tool_used': 'youtube_api'
            }
        
        except Exception as e:
            raise Exception(f"Failed to fetch transcript: {str(e)}")
    
    def find_keyword_timestamp(self, task: Dict, context: Dict) -> Dict:
        """
        Tool: Find the timestamp in transcript where a keyword is discussed using Gemini API
        
        Args:
            task: Task details
            context: Contains 'keyword', 'transcript_segments', and 'video_id'
            
        Returns:
            Dictionary with timestamp in seconds
        """
        keyword = context.get('keyword')
        transcript_segments = context.get('transcript_segments', [])
        video_id = context.get('video_id')
        
        if not keyword:
            raise ValueError("No keyword provided")
        
        if not transcript_segments:
            raise ValueError("No transcript segments provided")
        
        # Build transcript with timestamps for Gemini
        transcript_with_timestamps = "\n".join([
            f"[{seg['start']:.2f}s] {seg['text']}"
            for seg in transcript_segments
        ])
        
        # Prompt for Gemini to find the relevant timestamp
        # Limit transcript length to avoid token limits (take first 5000 segments or ~100k chars)
        max_segments = min(5000, len(transcript_segments))
        limited_segments = transcript_segments[:max_segments]
        limited_transcript = "\n".join([
            f"[{seg['start']:.2f}s] {seg['text']}"
            for seg in limited_segments
        ])
        
        prompt = f"""You are analyzing a YouTube video transcript to find where a specific keyword, topic, or concept is discussed.

Keyword/Topic/Concept: "{keyword}"

IMPORTANT: The keyword might be:
- A direct word or phrase mentioned in the transcript
- A concept or theme that is discussed without using the exact words
- An idea that is described or explained

Transcript with timestamps (showing first {max_segments} segments):
{limited_transcript}

Your task:
1. Search for where this keyword/topic/concept is meaningfully discussed
2. Look for:
   - Exact mentions of the keyword or its variations
   - Discussions of the concept even if different words are used
   - Related themes or ideas that match the keyword's meaning
3. Find the FIRST occurrence where this topic is discussed in detail
4. Return ONLY the timestamp in seconds as a number (e.g., 123.45)
5. If the keyword appears multiple times, return the timestamp of the most relevant/important discussion
6. If you truly cannot find any relevant discussion, return -1

Return ONLY the timestamp number (no explanation, no text, just the number):"""
        
        try:
            # Call Gemini API
            response = self.gemini_model.generate_content(prompt)
            timestamp_text = response.text.strip()
            
            print(f"🔍 Gemini response for keyword '{keyword}': {timestamp_text[:200]}")
            
            # Extract numeric timestamp
            try:
                # Try to extract number from response
                numbers = re.findall(r'\d+\.?\d*', timestamp_text)
                if numbers:
                    timestamp = float(numbers[0])
                    print(f"✅ Extracted timestamp: {timestamp}s for keyword '{keyword}'")
                else:
                    print(f"⚠️ No numbers found in response for keyword '{keyword}'")
                    timestamp = -1
            except Exception as e:
                print(f"⚠️ Error extracting timestamp: {str(e)}")
                timestamp = -1
            
            return {
                'keyword': keyword,
                'timestamp': timestamp,
                'video_id': video_id,
                'tool_used': 'gemini_api',
                'model': 'gemini-2.5-flash',
                'raw_response': timestamp_text[:200]  # Store first 200 chars for debugging
            }
        
        except Exception as e:
            print(f"❌ Error in find_keyword_timestamp for keyword '{keyword}': {str(e)}")
            import traceback
            traceback.print_exc()
            raise Exception(f"Failed to find keyword timestamp: {str(e)}")
    
    def generate_summary(self, task: Dict, context: Dict) -> Dict:
        """
        Tool: Generate summary using Google Gemini API
        
        Args:
            task: Task details
            context: Contains 'transcript' and 'summary_type'
            
        Returns:
            Dictionary with generated summary
        """
        transcript = context.get('transcript')
        summary_type = context.get('summary_type', 'comprehensive')
        
        if not transcript:
            raise ValueError("No transcript provided")
        
        # Prompt templates for different summary types
        prompts = {
            'comprehensive': """You are an expert podcast curator for PodVibe.fm's LEARNING MODE, designed for users who want to extract maximum educational value in minimum time using the 80/20 principle.

            MISSION: Extract the 20% of this podcast that delivers 80% of the learning value. Each segment should be a complete, standalone insight that can be understood independently.

            ===== WHAT QUALIFIES AS "20% VALUE" =====
            HIGH-VALUE CONTENT INCLUDES:
            - Novel frameworks or mental models that change how you think
            - Counter-intuitive insights that challenge common assumptions
            - Actionable steps with clear, specific implementation guidance
            - Data, studies, or research that supports conclusions with evidence
            - Expert synthesis of complex topics into understandable concepts
            - Practical examples or case studies illustrating abstract ideas
            - Clear cause-effect relationships with explanatory power
            - Skills or knowledge with high real-world utility
            - "Aha moments" where understanding clicks into place
            - Principles that apply across multiple contexts

            EXCLUDE (0% value):
            - Introductions, outros, advertisements, plugs
            - Meandering stories without clear takeaways
            - Repetitive explanations of the same point
            - Off-topic tangents or side conversations
            - Filler words, social niceties, transitional chat
            - "We'll get to that later" promises without delivery

            ===== SEGMENT REQUIREMENTS =====
            BOUNDARIES:
            - Topic changes (when conversation shifts to new subject)
            - Semantic completeness (full thought/argument/explanation)
            - Self-contained (can be understood without prior context)

            OUTPUT FORMAT:
            Provide a structured summary that:
            1. Identifies the highest-value insights (the 20%)
            2. Explains why each insight matters
            3. Includes specific examples or evidence when available
            4. Organizes content by major themes or topics
            5. Highlights actionable takeaways

            Focus on extracting maximum learning value. Be selective - quality over quantity.

            Transcript:
            {text}""",
                        'brief': """You are an expert podcast curator for PodVibe.fm's LEARNING MODE. Extract the 20% of this podcast that delivers 80% of the learning value.

            Focus on:
            - Novel frameworks or mental models
            - Counter-intuitive insights
            - Actionable steps with clear guidance
            - Evidence-based conclusions
            - Practical examples or case studies
            - High-utility skills or knowledge

            Exclude: introductions, outros, ads, filler, repetitive content, off-topic tangents.

            Provide a concise 2-3 paragraph summary focusing on the highest-value educational content.

            Transcript:
            {text}""",
                        'key_points': """You are an expert podcast curator for PodVibe.fm's LEARNING MODE. Extract the 20% of this podcast that delivers 80% of the learning value.

            Focus on extracting key points that are:
            - Novel frameworks or mental models
            - Counter-intuitive insights
            - Actionable with clear guidance
            - Evidence-based
            - High-utility skills or knowledge

            Exclude: introductions, outros, ads, filler, repetitive content, off-topic tangents.

            Extract the key points as a bulleted list. Focus on the most important insights and actionable takeaways that provide maximum learning value.

            Transcript:
            {text}"""
        }
        
        prompt = prompts.get(summary_type, prompts['comprehensive']).format(text=transcript)
        
        try:
            # Call Gemini API
            response = self.gemini_model.generate_content(prompt)
            summary = response.text
            
            return {
                'summary': summary,
                'summary_type': summary_type,
                'input_length': len(transcript),
                'output_length': len(summary),
                'tool_used': 'gemini_api',
                'model': 'gemini-pro'
            }
        
        except Exception as e:
            raise Exception(f"Failed to generate summary: {str(e)}")
    
    def extract_keywords(self, task: Dict, context: Dict) -> Dict:
        """
        Tool: Extract semantic keywords from summary using Gemini API
        
        Args:
            task: Task details
            context: Contains 'summary' text
            
        Returns:
            Dictionary with extracted keywords
        """
        summary = context.get('summary')
        
        if not summary:
            raise ValueError("No summary provided for keyword extraction")
        
        # Prompt for extracting semantic keywords
        prompt = """Analyze the following podcast summary and extract exactly 10 semantic keywords that best represent the core concepts, themes, and topics discussed.

Instructions:
- Focus on meaningful concepts and topics, not just frequent words
- Include technical terms, frameworks, and key ideas
- Prioritize multi-word phrases that capture important concepts (e.g., "artificial intelligence", "machine learning")
- Avoid generic words like "the", "is", "very"
- Order by importance/relevance
- Return ONLY the 10 keywords as a comma-separated list, nothing else

Summary:
{summary}

Keywords (comma-separated):""".format(summary=summary)
        
        try:
            # Call Gemini API
            response = self.gemini_model.generate_content(prompt)
            keywords_text = response.text.strip()
            
            # Parse the comma-separated keywords
            keywords = [kw.strip() for kw in keywords_text.split(',') if kw.strip()]
            
            # Ensure we have exactly 10 keywords
            keywords = keywords[:10]  # Take first 10 if more
            
            return {
                'keywords': keywords,
                'keywords_count': len(keywords),
                'tool_used': 'gemini_api',
                'model': 'gemini-2.5-flash'
            }
        
        except Exception as e:
            raise Exception(f"Failed to extract keywords: {str(e)}")
    
    def store_result(self, task: Dict, context: Dict) -> Dict:
        """
        Tool: Store final result (placeholder for memory storage)
        
        Args:
            task: Task details
            context: Contains all accumulated results
            
        Returns:
            Dictionary confirming storage
        """
        return {
            'stored': True,
            'context_keys': list(context.keys()),
            'tool_used': 'memory_store',
            'timestamp': datetime.now().isoformat()
        }
