"""
Executor Module - Executes planned tasks using LLMs and external tools
Part of the PodVibe.fm Agentic AI System
"""

import os
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
            'memory_store': self.store_result
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
            
            return {
                'transcript': transcript_text,
                'length': len(transcript_text),
                'segments': len(transcript.snippets),
                'video_id': video_id,
                'tool_used': 'youtube_api'
            }
        
        except Exception as e:
            raise Exception(f"Failed to fetch transcript: {str(e)}")
    
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
            'comprehensive': """Please provide a comprehensive summary of this podcast transcript. Include:
            1. Main topics discussed
            2. Key insights and takeaways
            3. Important quotes or statements
            4. Overall conclusion

            Transcript:
            {text}""",
                        'brief': """Provide a brief 2-3 paragraph summary of this podcast transcript, focusing on the main points.

            Transcript:
            {text}""",
                        'key_points': """Extract the key points from this podcast transcript as a bulleted list. Focus on the most important insights and actionable takeaways.

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
