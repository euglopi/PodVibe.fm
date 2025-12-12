"""
Planner Module - Breaks down user goals into sub-tasks
Part of the PodVibe.fm Agentic AI System
"""

from typing import List, Dict
from datetime import datetime


class Planner:
    """
    Planner component that breaks down the summarization task into discrete sub-tasks.
    Follows the ReAct (Reasoning + Acting) pattern.
    """
    
    def __init__(self):
        """Initialize the planner with task templates"""
        self.task_templates = {
            'summarize': [
                {
                    'step': 1,
                    'action': 'extract_video_id',
                    'description': 'Parse YouTube URL and extract video ID',
                    'tool': 'url_parser',
                    'status': 'pending'
                },
                {
                    'step': 2,
                    'action': 'fetch_transcript',
                    'description': 'Retrieve video transcript from YouTube',
                    'tool': 'youtube_api',
                    'status': 'pending'
                },
                {
                    'step': 3,
                    'action': 'generate_summary',
                    'description': 'Generate AI summary using Gemini',
                    'tool': 'gemini_api',
                    'status': 'pending'
                },
                {
                    'step': 4,
                    'action': 'extract_keywords',
                    'description': 'Extract 10 semantic keywords from summary',
                    'tool': 'keyword_extractor',
                    'status': 'pending'
                },
                {
                    'step': 5,
                    'action': 'store_result',
                    'description': 'Store summary and metadata',
                    'tool': 'memory_store',
                    'status': 'pending'
                }
            ]
        }
    
    def create_plan(self, user_input: Dict) -> List[Dict]:
        """
        Create an execution plan based on user input
        
        Args:
            user_input: Dictionary containing:
                - url: YouTube video URL
                - summary_type: Type of summary requested
                
        Returns:
            List of sub-tasks to execute
        """
        # For this agent, we use the 'summarize' template
        plan = self.task_templates['summarize'].copy()
        
        # Annotate plan with user context
        plan_with_context = []
        for task in plan:
            task_copy = task.copy()
            task_copy['context'] = {
                'url': user_input.get('url'),
                'summary_type': user_input.get('summary_type', 'comprehensive'),
                'timestamp': datetime.now().isoformat()
            }
            plan_with_context.append(task_copy)
        
        return plan_with_context
    
    def update_task_status(self, plan: List[Dict], step: int, status: str, result: any = None) -> List[Dict]:
        """
        Update the status of a specific task in the plan
        
        Args:
            plan: Current execution plan
            step: Step number to update
            status: New status ('pending', 'in_progress', 'completed', 'failed')
            result: Optional result data from task execution
            
        Returns:
            Updated plan
        """
        for task in plan:
            if task['step'] == step:
                task['status'] = status
                task['updated_at'] = datetime.now().isoformat()
                if result is not None:
                    task['result'] = result
                break
        
        return plan
    
    def get_next_task(self, plan: List[Dict]) -> Dict:
        """
        Get the next pending task from the plan
        
        Args:
            plan: Current execution plan
            
        Returns:
            Next task to execute, or None if all tasks complete
        """
        for task in plan:
            if task['status'] == 'pending':
                return task
        return None
    
    def is_plan_complete(self, plan: List[Dict]) -> bool:
        """
        Check if all tasks in the plan are completed
        
        Args:
            plan: Current execution plan
            
        Returns:
            True if all tasks completed, False otherwise
        """
        return all(task['status'] == 'completed' for task in plan)
    
    def get_plan_summary(self, plan: List[Dict]) -> Dict:
        """
        Generate a summary of the current plan state
        
        Args:
            plan: Current execution plan
            
        Returns:
            Dictionary with plan statistics
        """
        total_tasks = len(plan)
        completed = sum(1 for task in plan if task['status'] == 'completed')
        failed = sum(1 for task in plan if task['status'] == 'failed')
        pending = sum(1 for task in plan if task['status'] == 'pending')
        in_progress = sum(1 for task in plan if task['status'] == 'in_progress')
        
        return {
            'total_tasks': total_tasks,
            'completed': completed,
            'failed': failed,
            'pending': pending,
            'in_progress': in_progress,
            'completion_rate': f"{(completed/total_tasks)*100:.1f}%"
        }
