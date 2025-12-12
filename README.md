# PodVibe.fm - AI-Powered Podcast Summarizer

> **Skip the fluff. Get the wisdom.**  
> An intelligent agentic AI system that extracts the 20% of podcast content that delivers 80% of the learning value, powered by Google Gemini.

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🎯 Overview

PodVibe.fm is a complete agentic AI system that transforms long-form YouTube podcast videos into concise, high-value summaries. Built for the **Agentic AI Hackathon**, it demonstrates a production-ready architecture with planning, execution, and observability components.

### Key Features

- 🧠 **Agentic AI Architecture** - Modular design with Planner, Executor, and Memory components
- 🎙️ **Intelligent Summarization** - Uses Google Gemini to extract the 20% of content that delivers 80% of value
- 🔍 **Semantic Keyword Extraction** - Identifies 10 core concepts for quick navigation
- ⏱️ **Timestamp Navigation** - Click keywords to jump to where topics are discussed
- 📊 **Full Observability** - Complete memory logging of all agent decisions and actions
- 🎨 **Modern UI** - React frontend with Streamlit interface for development
- 🔄 **ReAct Pattern** - Demonstrates Reasoning + Acting workflow

## 🏗️ Architecture

This agent follows a clean agentic AI pattern with three core modules:

```
User Input → PLANNER → EXECUTOR → MEMORY
                ↓          ↓          ↓
           Sub-tasks   Tool Calls  Logging
                         ↓
                   [YouTube API]
                   [Gemini API]
```

### Core Components

1. **Planner** (`src/planner.py`) - Breaks down user goals into executable sub-tasks
2. **Executor** (`src/executor.py`) - Executes tasks using appropriate tools (YouTube API, Gemini API)
3. **Memory** (`src/memory.py`) - Logs all agent activities for full observability

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Google Gemini API Key** 
- **YouTube API Key** (Optional) - For trending videos feature

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/euglopi/PodVibe.fm.git
   cd PodVibe.fm
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your-gemini-api-key-here
   YOUTUBE_API_KEY=your-youtube-api-key-here  # Optional
   ```

### Running the Application

#### Option 1: Streamlit UI (Recommended for Testing)

```bash
cd src
streamlit run app.py
```

Open your browser to `http://localhost:8501`

#### Option 2: Flask API Server

```bash
cd src
python api.py
```

API will be available at `http://localhost:8000`

**Available Endpoints:**
- `GET /api/health` - Health check
- `POST /api/summarize` - Summarize a YouTube video
- `GET /api/trending` - Get trending podcasts by category
- `POST /api/find-timestamp` - Find where keywords are discussed
- `GET /api/models` - List available Gemini models

#### Option 3: React Frontend

```bash
# Terminal 1: Start Flask backend
cd src
python api.py

# Terminal 2: Start React frontend
cd frontend
npm install
npm run dev
```

#### Option 4: Direct Python Usage

```bash
cd src
python youtube_summarizer.py
```

## 📖 How It Works

### 1. Planning Phase (ReAct: Reasoning)

The **Planner** creates an execution plan by breaking down the summarization task:

1. Extract video ID from YouTube URL
2. Fetch transcript from YouTube
3. Generate AI summary using Gemini (80/20 principle)
4. Extract 10 semantic keywords
5. Store results with metadata

### 2. Execution Phase (ReAct: Acting)

The **Executor** runs each task using appropriate tools:

- **URL Parser** - Extracts video ID from various YouTube URL formats
- **YouTube API** - Fetches transcripts with timestamps
- **Gemini API** - Generates intelligent summaries focusing on high-value content
- **Keyword Extractor** - Identifies core concepts using semantic analysis
- **Timestamp Finder** - Locates where topics are discussed in the video

### 3. Memory & Observability

The **Memory** component logs every step:

- User inputs
- Execution plans
- Task start/completion/failure events
- Tool calls and results
- Final outputs
- Error details

All logs are available via API or exported to JSON files in `logs/` directory.

For detailed technical explanation, see [EXPLANATION.md](EXPLANATION.md).

## 🎯 Hackathon Requirements

✅ **Google Gemini API Integration** - Core AI engine for intelligent summarization  
✅ **Agentic Architecture** - Modular design with Planner, Executor, and Memory  
✅ **ReAct Pattern** - Reasoning + Acting workflow demonstrated  
✅ **Tool Integration** - YouTube Transcript API + Gemini API  
✅ **Full Observability** - Complete memory logging of all agent decisions  
✅ **Complete Documentation** - Architecture, explanation, and demo included  

## 📁 Project Structure

```
PodVibe.fm/
├── src/                          # Backend source code
│   ├── planner.py               # Planning module
│   ├── executor.py              # Execution module
│   ├── memory.py                # Memory/observability module
│   ├── youtube_summarizer.py   # Main agent orchestrator
│   ├── api.py                   # Flask REST API
│   ├── app.py                   # Streamlit UI
│   └── trending.py              # Trending videos API
│
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Landing page
│   │   │   ├── Browse.tsx      # Browse trending
│   │   │   └── Player.tsx      # Video player
│   │   └── components/         # UI components
│   └── package.json
│
├── logs/                         # Memory logs (auto-generated)
├── podcasts_out/                 # Saved summaries
│
├── ARCHITECTURE.md              # System architecture documentation
├── EXPLANATION.md               # Technical explanation
├── DEMO.md                      # Demo video link
├── README.md                    # This file
└── requirements.txt             # Python dependencies
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for summarization |
| `YOUTUBE_API_KEY` | No | YouTube Data API key for trending videos (falls back to sample data) |

### Summary Types

The system supports three summary types:

- **comprehensive** - Detailed summary with full context (default)
- **brief** - Concise 2-3 paragraph summary
- **key_points** - Bulleted list of main takeaways

## 📊 API Usage Examples

### Summarize a Video

```bash
curl -X POST http://localhost:8000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=VIDEO_ID"}'
```

### Find Keyword Timestamp

```bash
curl -X POST http://localhost:8000/api/find-timestamp \
  -H "Content-Type: application/json" \
  -d '{
    "video_id": "VIDEO_ID",
    "keyword": "artificial intelligence"
  }'
```

### Get Trending Podcasts

```bash
curl http://localhost:8000/api/trending
```

## 🧪 Testing

### Manual Testing

1. **Streamlit UI** - Interactive testing with visual feedback
2. **Flask API** - Test endpoints with curl or Postman
3. **Direct Python** - Run `python src/youtube_summarizer.py`

### Test Scenarios

- ✅ Valid YouTube URLs with transcripts
- ✅ Invalid URLs (error handling)
- ✅ Videos without transcripts
- ✅ Different summary types
- ✅ Keyword extraction accuracy
- ✅ Memory logging completeness

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed system architecture and component design
- **[EXPLANATION.md](EXPLANATION.md)** - Technical explanation of agent workflow and implementation
- **[DEMO.md](DEMO.md)** - Video demonstration

## 🤝 Contributing

This is a hackathon submission. For questions or feedback, please open an issue.

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** - Powerful AI for intelligent summarization
- **YouTube Transcript API** - Reliable transcript fetching
- **Agentic AI Hackathon** - Inspiration and framework

---

**Built with ❤️ for the Agentic AI Hackathon**

*Skip the fluff. Get the wisdom.*
