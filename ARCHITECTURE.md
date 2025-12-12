# Architecture Overview

PodVibe.fm is built on a clean agentic AI architecture that separates concerns into distinct, modular components. The system follows the ReAct (Reasoning + Acting) pattern, demonstrating a complete agentic workflow from planning through execution to observability.

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────┬───────────────────┬───────────────────────┤
│   React Frontend    │   Streamlit UI    │   Direct API Calls    │
│   (Browse/Player)   │   (Interactive)   │   (Programmatic)      │
└──────────┬──────────┴─────────┬─────────┴───────────┬───────────┘
           │                    │                     │
           └────────────────────┼─────────────────────┘
                                │
                    ┌───────────▼────────────┐
                    │    FLASK API SERVER    │
                    │    (src/api.py)        │
                    │  - /api/summarize      │
                    │  - /api/trending       │
                    │  - /api/find-timestamp │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼──────────────────────────────────┐
                    │         YOUTUBE SUMMARIZER                   │
                    │      (Main Orchestrator)                     │
                    │      (src/youtube_summarizer.py)             │
                    └───────────┬──────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼────────┐    ┌─────────▼─────────┐   ┌────────▼────────┐
│    PLANNER     │    │     EXECUTOR      │   │     MEMORY      │
│ (planner.py)   │    │  (executor.py)    │   │  (memory.py)    │
│                │    │                   │   │                 │
│ - Create Plan  │    │ - Execute Tasks   │   │ - Log Events    │
│ - Track Status │    │ - Call Tools      │   │ - Store History │
│ - Get Next     │    │ - Handle Errors   │   │ - Export Logs   │
└───────┬────────┘    └─────────┬─────────┘   └────────┬────────┘
        │                       │                       │
        │              ┌─────────▼─────────┐            │
        │              │    TOOL REGISTRY  │            │
        │              │                   │            │
        │              │ - url_parser      │            │
        │              │ - youtube_api     │            │
        │              │ - gemini_api      │            │
        │              │ - keyword_extract │            │
        │              │ - timestamp_find  │            │
        │              └─────────┬─────────┘            │
        │                        │                      │
        └────────────────────────┼──────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼────────┐    ┌──────────▼──────────┐   ┌────────▼────────┐
│  YOUTUBE API   │    │   GEMINI API        │   │  FILE SYSTEM    │
│                │    │                     │   │                 │
│ - Transcripts  │    │ - Summarization     │   │ - Logs Storage  │
│ - Video Data   │    │ - Keyword Extract   │   │ - Result Cache  │
│ - Trending     │    │ - Timestamp Find    │   │                 │
└────────────────┘    └─────────────────────┘   └─────────────────┘
```

## Component Details

### 1. User Interface Layer

#### React Frontend (`frontend/`)
- **Purpose:** Modern web interface for browsing and playing podcasts
- **Technology:** React + TypeScript + Vite
- **Key Features:**
  - Landing page with waitlist
  - Browse page showing trending podcasts by category
  - Player page with video playback and summaries
  - Keyword-based navigation (click keywords to jump to timestamps)
- **Communication:** REST API calls to Flask backend

#### Streamlit UI (`src/app.py`)
- **Purpose:** Interactive development and testing interface
- **Technology:** Streamlit
- **Key Features:**
  - Direct YouTube URL input
  - Real-time processing visualization
  - Summary display with tabs (Summary, Transcript, Memory Log)
  - Download functionality
- **Use Case:** Developer tool, quick testing, demonstrations

#### Direct API (`src/api.py`)
- **Purpose:** RESTful API for programmatic access
- **Technology:** Flask + Flask-CORS
- **Endpoints:**
  - `GET /api/health` - Health check
  - `POST /api/summarize` - Main summarization endpoint
  - `GET /api/trending` - Get trending podcasts by category
  - `POST /api/find-timestamp` - Find where keywords are discussed
  - `GET /api/models` - List available Gemini models

### 2. Agent Core

#### Planner (`src/planner.py`)
**Responsibility:** Task decomposition and plan management

**Architecture:**
- Template-based planning system
- Predefined task sequences for common workflows
- State tracking (pending → in_progress → completed/failed)
- Context propagation between tasks

**Key Data Structures:**
```python
task = {
    'step': int,
    'action': str,           # e.g., 'extract_video_id'
    'description': str,
    'tool': str,             # e.g., 'url_parser'
    'status': str,           # 'pending' | 'in_progress' | 'completed' | 'failed'
    'context': dict,         # User input and accumulated results
    'result': dict           # Optional: execution result
}
```

**Design Pattern:** Strategy pattern - different plan templates for different use cases (currently: 'summarize')

#### Executor (`src/executor.py`)
**Responsibility:** Tool execution and API integration

**Architecture:**
- Tool registry pattern
- Each tool is a method that can be called by name
- Consistent interface: `tool(task: Dict, context: Dict) -> Dict`
- Error handling and result standardization

**Tool Registry:**
```python
tools = {
    'url_parser': extract_video_id,
    'youtube_api': fetch_transcript,
    'gemini_api': generate_summary,
    'keyword_extractor': extract_keywords,
    'keyword_timestamp_finder': find_keyword_timestamp,
    'memory_store': store_result
}
```

**Design Pattern:** Registry pattern - tools registered by name, executed dynamically

**Key Tools:**

1. **url_parser** - URL parsing logic
   - Handles multiple YouTube URL formats
   - Extracts video ID reliably

2. **youtube_api** - Transcript fetching
   - Uses `youtube-transcript-api` library
   - Returns structured segments with timestamps
   - Error handling for missing transcripts

3. **gemini_api** - AI summarization
   - Uses Google Gemini 2.5 Flash model
   - Specialized prompts for 80/20 principle
   - Multiple summary types supported

4. **keyword_extractor** - Semantic keyword extraction
   - Uses Gemini to analyze summaries
   - Extracts 10 most relevant keywords
   - Orders by importance

5. **keyword_timestamp_finder** - Advanced navigation
   - Uses Gemini to find where topics are discussed
   - Semantic understanding (not just keyword matching)
   - Returns precise timestamps

#### Memory (`src/memory.py`)
**Responsibility:** Observability and audit trail

**Architecture:**
- Event-driven logging system
- Session-based tracking
- Optional persistence to disk
- Structured event data

**Event Types:**
- `user_input` - Initial request
- `plan_created` - Execution plan
- `task_started` - Task initiation
- `task_completed` - Successful completion
- `task_failed` - Task failure
- `final_result` - Complete output

**Design Pattern:** Observer pattern - events logged as they occur

**Storage:**
- In-memory by default (list of event dictionaries)
- Optional file persistence to `logs/` directory
- JSON format for easy inspection
- Session-based file naming

### 3. Tools / APIs

#### Google Gemini API
**Integration:** `google.generativeai` library

**Usage:**
- **Model:** `gemini-2.5-flash` (latest stable)
- **Primary Use:** Text generation (summaries, keywords, timestamp finding)
- **Configuration:** API key from environment variable

**Prompt Engineering:**
- Specialized prompts for "Learning Mode"
- 80/20 principle focus (extract high-value content)
- Structured output requirements
- Error handling for API failures

#### YouTube Transcript API
**Integration:** `youtube-transcript-api` Python library

**Usage:**
- Fetches English transcripts
- Returns structured segments with timestamps
- Handles various video formats

**Error Handling:**
- Missing transcripts
- Language issues
- Network failures

#### YouTube Data API (Optional)
**Integration:** Direct REST API calls

**Usage:**
- Trending video discovery
- Video metadata retrieval
- Category-based filtering

**Features:**
- Filters: English, podcast-tagged, 1+ hour duration, last 14 days
- Fallback to sample data if API key not available

### 4. Data Flow

#### Summarization Flow
```
User Input (URL)
    ↓
Planner.create_plan()
    ↓
Plan: [extract_id, fetch_transcript, generate_summary, extract_keywords, store]
    ↓
For each task in plan:
    ↓
Executor.execute_task(task, context)
    ↓
Tool execution (e.g., gemini_api.generate_summary())
    ↓
Result added to context
    ↓
Memory.log_task_completion()
    ↓
Next task...
    ↓
Final result with all data
    ↓
Memory.log_final_result()
    ↓
Return to user
```

#### Keyword Timestamp Finding Flow
```
User clicks keyword
    ↓
Frontend calls /api/find-timestamp
    ↓
Executor.fetch_transcript() (if not cached)
    ↓
Executor.find_keyword_timestamp()
    ↓
Gemini analyzes transcript segments
    ↓
Returns timestamp
    ↓
Frontend seeks video to timestamp
```

### 5. Observability

#### Logging Architecture
- **Event-Driven:** Every significant action logged
- **Structured Data:** JSON format for easy parsing
- **Session Tracking:** Unique session IDs for grouping
- **Timeline View:** Chronological execution events
- **Statistics:** Session summaries with metrics

#### Memory Export
- JSON files in `logs/` directory
- Includes session summary and full event log
- Timestamped filenames
- Human-readable format

#### Debugging Support
- Full error stack traces
- Tool execution results
- Context data at each step
- API response details

## Design Principles

### 1. Separation of Concerns
- **Planner:** Only handles task decomposition
- **Executor:** Only handles tool execution
- **Memory:** Only handles logging
- **Orchestrator:** Coordinates components

### 2. Modularity
- Each component is independently testable
- Tools can be added/removed without affecting others
- Clear interfaces between components

### 3. Observability First
- Every action is logged
- Full audit trail available
- Easy debugging and analysis

### 4. Error Handling
- Graceful degradation
- Clear error messages
- Task-level failure tracking

### 5. Extensibility
- Easy to add new tools
- Easy to add new plan templates
- Easy to add new summary types

## Technology Stack

### Backend
- **Python 3.8+**
- **Flask** - REST API server
- **Streamlit** - Interactive UI
- **google-generativeai** - Gemini API client
- **youtube-transcript-api** - Transcript fetching
- **python-dotenv** - Environment variable management

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling

### Infrastructure
- **File System** - Log storage
- **Environment Variables** - Configuration
- **CORS** - Cross-origin support

## Scalability Considerations

### Current Limitations
- Single-threaded execution
- In-memory storage by default
- Synchronous API calls
- No caching layer

### Future Enhancements
- Background job processing (Celery, RQ)
- Database storage for logs and results
- Caching layer (Redis) for transcripts/summaries
- Parallel task execution where possible
- Rate limiting and quota management
- Horizontal scaling support
