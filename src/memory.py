"""
Memory Module - Manages agent memory, logging, and state
Part of the PodVibe.fm Agentic AI System
"""

import json
from typing import List, Dict, Any
from datetime import datetime
import os


class Memory:
    """
    Memory component that stores agent activities, decisions, and results.
    Provides observability into the agent's reasoning process.
    """
    
    def __init__(self, persist_to_file: bool = False, log_file: str = "agent_memory.json"):
        """
        Initialize the memory store
        
        Args:
            persist_to_file: Whether to save memory to disk
            log_file: Path to log file if persisting
        """
        self.memory = []
        self.persist_to_file = persist_to_file
        self.log_file = log_file
        self.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    def log_event(self, event_type: str, data: Dict[str, Any]) -> None:
        """
        Log an event to memory
        
        Args:
            event_type: Type of event (planning, execution, error, result)
            data: Event data dictionary
        """
        entry = {
            'session_id': self.session_id,
            'timestamp': datetime.now().isoformat(),
            'event_type': event_type,
            'data': data
        }
        
        self.memory.append(entry)
        
        if self.persist_to_file:
            self._save_to_file()
    
    def log_plan_creation(self, plan: List[Dict]) -> None:
        """
        Log when a new plan is created
        
        Args:
            plan: The execution plan
        """
        self.log_event('plan_created', {
            'total_tasks': len(plan),
            'tasks': [{'step': t['step'], 'action': t['action']} for t in plan]
        })
    
    def log_task_start(self, task: Dict) -> None:
        """
        Log when a task begins execution
        
        Args:
            task: The task being executed
        """
        self.log_event('task_started', {
            'step': task.get('step'),
            'action': task.get('action'),
            'tool': task.get('tool')
        })
    
    def log_task_completion(self, task: Dict, result: Dict) -> None:
        """
        Log when a task completes successfully
        
        Args:
            task: The completed task
            result: Execution result
        """
        self.log_event('task_completed', {
            'step': task.get('step'),
            'action': task.get('action'),
            'status': result.get('status'),
            'result_summary': self._summarize_result(result)
        })
    
    def log_task_failure(self, task: Dict, error: str) -> None:
        """
        Log when a task fails
        
        Args:
            task: The failed task
            error: Error message
        """
        self.log_event('task_failed', {
            'step': task.get('step'),
            'action': task.get('action'),
            'error': error
        })
    
    def log_user_input(self, user_input: Dict) -> None:
        """
        Log user input
        
        Args:
            user_input: User's input data
        """
        self.log_event('user_input', {
            'url': user_input.get('url'),
            'summary_type': user_input.get('summary_type')
        })
    
    def log_final_result(self, result: Dict) -> None:
        """
        Log the final agent output
        
        Args:
            result: Final result dictionary
        """
        self.log_event('final_result', {
            'video_id': result.get('video_id'),
            'summary_length': len(result.get('summary', '')),
            'transcript_length': len(result.get('transcript', '')),
            'success': True
        })
    
    def get_memory(self, event_type: str = None) -> List[Dict]:
        """
        Retrieve memory entries
        
        Args:
            event_type: Optional filter by event type
            
        Returns:
            List of memory entries
        """
        if event_type:
            return [entry for entry in self.memory if entry['event_type'] == event_type]
        return self.memory
    
    def get_session_summary(self) -> Dict:
        """
        Get a summary of the current session
        
        Returns:
            Dictionary with session statistics
        """
        event_counts = {}
        for entry in self.memory:
            event_type = entry['event_type']
            event_counts[event_type] = event_counts.get(event_type, 0) + 1
        
        return {
            'session_id': self.session_id,
            'total_events': len(self.memory),
            'event_breakdown': event_counts,
            'start_time': self.memory[0]['timestamp'] if self.memory else None,
            'end_time': self.memory[-1]['timestamp'] if self.memory else None
        }
    
    def get_execution_timeline(self) -> List[Dict]:
        """
        Get a chronological timeline of task execution
        
        Returns:
            List of execution events in order
        """
        execution_events = ['task_started', 'task_completed', 'task_failed']
        return [
            {
                'timestamp': entry['timestamp'],
                'event': entry['event_type'],
                'details': entry['data']
            }
            for entry in self.memory
            if entry['event_type'] in execution_events
        ]
    
    def clear_memory(self) -> None:
        """Clear all memory entries"""
        self.memory = []
        self.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    def _summarize_result(self, result: Dict) -> Dict:
        """
        Create a summary of execution result for logging
        
        Args:
            result: Full execution result
            
        Returns:
            Summarized result
        """
        summary = {
            'status': result.get('status'),
            'tool_used': result.get('result', {}).get('tool_used')
        }
        
        # Add specific metrics based on result content
        result_data = result.get('result', {})
        if 'length' in result_data:
            summary['data_length'] = result_data['length']
        if 'video_id' in result_data:
            summary['video_id'] = result_data['video_id']
        if 'summary_type' in result_data:
            summary['summary_type'] = result_data['summary_type']
        
        return summary
    
    def _save_to_file(self) -> None:
        """Save memory to file"""
        try:
            # Create logs directory if it doesn't exist
            os.makedirs('logs', exist_ok=True)
            
            log_path = os.path.join('logs', f"{self.session_id}_{self.log_file}")
            
            with open(log_path, 'w', encoding='utf-8') as f:
                json.dump(self.memory, f, indent=2, ensure_ascii=False)
        
        except Exception as e:
            print(f"Warning: Failed to save memory to file: {e}")
    
    def export_memory(self, filepath: str = None) -> str:
        """
        Export memory to a JSON file
        
        Args:
            filepath: Optional custom filepath
            
        Returns:
            Path to exported file
        """
        if not filepath:
            os.makedirs('logs', exist_ok=True)
            filepath = os.path.join('logs', f"memory_export_{self.session_id}.json")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump({
                'session_summary': self.get_session_summary(),
                'memory': self.memory
            }, f, indent=2, ensure_ascii=False)
        
        return filepath
