"""
PodVibe.fm - AI-Powered Podcast Summarizer
This agent fetches YouTube video transcripts and generates summaries using Gemini API

Architecture:
- Planner: Breaks down summarization into sub-tasks (ReAct pattern)
- Executor: Executes tasks using external tools (YouTube API, Gemini API)
- Memory: Logs all agent activities for full observability
"""

import os
from typing import Dict, List, Optional
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import modular components
from planner import Planner
from executor import Executor
from memory import Memory


class YouTubeSummarizer:
    """
    Main Agentic AI for summarizing YouTube podcasts
    
    Architecture Components:
    - Planner: Creates execution plans by breaking down tasks
    - Executor: Executes tasks using external tools and APIs
    - Memory: Tracks all agent activities and decisions
    """
    
    def __init__(self, api_key: Optional[str] = None, persist_memory: bool = False):
        """
        Initialize the YouTube Summarizer Agent
        
        Args:
            api_key: Google Gemini API key (if not provided, uses GEMINI_API_KEY env var)
            persist_memory: Whether to save memory logs to disk
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key is required. Set GEMINI_API_KEY environment variable or pass api_key parameter")
        
        # Initialize modular components
        self.planner = Planner()
        self.executor = Executor(api_key=self.api_key)
        self.memory = Memory(persist_to_file=persist_memory)
        
    def extract_video_id(self, url: str) -> str:
        """
        Extract video ID from YouTube URL (delegates to executor)
        
        Args:
            url: YouTube video URL
            
        Returns:
            Video ID string
        """
        task = {'action': 'extract_video_id', 'tool': 'url_parser'}
        context = {'url': url}
        result = self.executor.execute_task(task, context)
        
        if result['status'] == 'success':
            return result['result']['video_id']
        else:
            raise Exception(f"Failed to extract video ID: {result.get('error')}")
    
    def get_transcript(self, video_id: str) -> str:
        """
        Fetch transcript from YouTube video (delegates to executor)
        
        Args:
            video_id: YouTube video ID
            
        Returns:
            Full transcript text
        """
        task = {'action': 'fetch_transcript', 'tool': 'youtube_api'}
        context = {'video_id': video_id}
        result = self.executor.execute_task(task, context)
        
        if result['status'] == 'success':
            return result['result']['transcript']
        else:
            raise Exception(f"Failed to fetch transcript: {result.get('error')}")
    
    def summarize_text(self, text: str, summary_type: str = 'comprehensive') -> str:
        """
        Generate summary using Gemini API (delegates to executor)
        
        Args:
            text: Text to summarize
            summary_type: Type of summary ('comprehensive', 'brief', 'key_points')
            
        Returns:
            Summary text
        """
        task = {'action': 'generate_summary', 'tool': 'gemini_api'}
        context = {'transcript': text, 'summary_type': summary_type}
        result = self.executor.execute_task(task, context)
        
        if result['status'] == 'success':
            return result['result']['summary']
        else:
            raise Exception(f"Failed to generate summary: {result.get('error')}")
    
    def process_youtube_url(self, url: str, summary_type: str = 'comprehensive') -> Dict:
        """
        Main Agentic Workflow: Process YouTube URL and generate summary
        
        This method demonstrates the full ReAct (Reasoning + Acting) pattern:
        1. PLAN: Create execution plan with sub-tasks
        2. ACT: Execute each task using appropriate tools
        3. OBSERVE: Log all actions to memory
        4. RESPOND: Return final result
        
        Args:
            url: YouTube video URL
            summary_type: Type of summary to generate
            
        Returns:
            Dictionary containing video_id, transcript, and summary
        """
        print(f"🎬 Processing YouTube URL: {url}")
        
        # Log user input to memory
        user_input = {'url': url, 'summary_type': summary_type}
        self.memory.log_user_input(user_input)
        
        # STEP 1: PLANNING - Create execution plan
        print("\n🧠 Planning: Creating execution plan...")
        plan = self.planner.create_plan(user_input)
        self.memory.log_plan_creation(plan)
        print(f"✓ Plan created with {len(plan)} tasks")
        
        # STEP 2: EXECUTION - Execute plan step by step
        print("\n� Execution: Running planned tasks...\n")
        
        execution_context = user_input.copy()
        
        while not self.planner.is_plan_complete(plan):
            # Get next task
            task = self.planner.get_next_task(plan)
            if not task:
                break
            
            print(f"📝 Task {task['step']}: {task['description']}")
            
            # Log task start
            self.memory.log_task_start(task)
            
            # Update task status to in_progress
            plan = self.planner.update_task_status(plan, task['step'], 'in_progress')
            
            try:
                # Execute task using executor
                result = self.executor.execute_task(task, execution_context)
                
                if result['status'] == 'success':
                    # Update plan with success
                    plan = self.planner.update_task_status(plan, task['step'], 'completed', result)
                    
                    # Update execution context with result data
                    execution_context.update(result.get('result', {}))
                    
                    # Log success
                    self.memory.log_task_completion(task, result)
                    print(f"✅ Completed: {task['action']}\n")
                else:
                    # Task failed
                    plan = self.planner.update_task_status(plan, task['step'], 'failed', result)
                    self.memory.log_task_failure(task, result.get('error', 'Unknown error'))
                    raise Exception(f"Task failed: {result.get('error')}")
            
            except Exception as e:
                self.memory.log_task_failure(task, str(e))
                raise
        
        # STEP 3: FINALIZE - Prepare final result
        print("📊 Finalizing results...")
        
        final_result = {
            'video_id': execution_context.get('video_id'),
            'url': url,
            'transcript': execution_context.get('transcript'),
            'transcript_segments': execution_context.get('transcript_segments', []),  # Store segments with timestamps
            'transcript_length': len(execution_context.get('transcript', '')),
            'segments': execution_context.get('segments', 0),
            'summary': execution_context.get('summary'),
            'keywords': execution_context.get('keywords', []),
            'summary_type': summary_type,
            'timestamp': datetime.now().isoformat(),
            'plan_summary': self.planner.get_plan_summary(plan)
        }
        
        # Log final result
        self.memory.log_final_result(final_result)
        
        print("✅ Processing complete!\n")
        
        return final_result
    
    def save_summary(self, result: Dict, output_file: str):
        """
        Save summary to file
        
        Args:
            result: Summary result dictionary
            output_file: Path to output file
        """
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        print(f"💾 Summary saved to: {output_file}")
    
    def get_memory_log(self) -> List[Dict]:
        """
        Get agent's memory/activity log for full observability
        
        Returns:
            List of memory entries showing all agent decisions
        """
        return self.memory.get_memory()
    
    def get_session_summary(self) -> Dict:
        """
        Get summary of the current session
        
        Returns:
            Dictionary with session statistics
        """
        return self.memory.get_session_summary()
    
    def get_execution_timeline(self) -> List[Dict]:
        """
        Get chronological timeline of task execution
        
        Returns:
            Ordered list of execution events
        """
        return self.memory.get_execution_timeline()
    
    def export_memory(self, filepath: str = None) -> str:
        """
        Export memory logs to file
        
        Args:
            filepath: Optional custom filepath
            
        Returns:
            Path to exported file
        """
        return self.memory.export_memory(filepath)
    
    def find_keyword_timestamp(self, video_id: str, keyword: str, transcript_segments: List[Dict]) -> float:
        """
        Find the timestamp where a keyword is discussed in the transcript
        
        Args:
            video_id: YouTube video ID
            keyword: Keyword to search for
            transcript_segments: List of transcript segments with timestamps
            
        Returns:
            Timestamp in seconds, or -1 if not found
        """
        task = {'action': 'find_keyword_timestamp', 'tool': 'keyword_timestamp_finder'}
        context = {
            'keyword': keyword,
            'video_id': video_id,
            'transcript_segments': transcript_segments
        }
        result = self.executor.execute_task(task, context)
        
        if result['status'] == 'success':
            return result['result'].get('timestamp', -1)
        else:
            raise Exception(f"Failed to find keyword timestamp: {result.get('error')}")


def main():
    """Demo usage"""
    import sys
    
    # Check for API key
    if not os.getenv('GEMINI_API_KEY'):
        print("❌ Error: GEMINI_API_KEY environment variable not set")
        print("Please set it using: $env:GEMINI_API_KEY='your-api-key'")
        sys.exit(1)
    
    # Example usage
    summarizer = YouTubeSummarizer()
    
    # Example YouTube URL (replace with actual podcast URL)
    youtube_url = input("Enter YouTube podcast URL: ")
    
    if not youtube_url.strip():
        print("Using example URL for demonstration...")
        youtube_url = "https://www.youtube.com/watch?v=aR20FWCCjAs"
    
    try:
        # Process the video
        result = summarizer.process_youtube_url(youtube_url, summary_type='comprehensive')
        
        # Display summary
        print("\n" + "="*80)
        print("📊 SUMMARY")
        print("="*80)
        print(result['summary'])
        print("="*80)
        
        # Save to file
        output_file = f"summary_{result['video_id']}.json"
        summarizer.save_summary(result, output_file)
        
        # Show memory log
        print("\n📋 Agent Memory Log:")
        for entry in summarizer.get_memory_log():
            event_type = entry.get('event_type', 'unknown')
            details = entry.get('details', {})
            if event_type == 'task_start':
                print(f"  - {entry['timestamp']}: Started task: {details.get('task_name', 'N/A')}")
            elif event_type == 'task_complete':
                print(f"  - {entry['timestamp']}: Completed task: {details.get('task_name', 'N/A')}")
            else:
                print(f"  - {entry['timestamp']}: {event_type}")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
