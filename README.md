# YouTube Podcast Summarizer - Agentic AI Hackathon Submission

start backend:

```

```

An intelligent agent that summarizes YouTube podcast transcripts using Google Gemini AI, demonstrating a complete agentic AI architecture with planning, execution, and memory components.

## 🎯 Hackathon Requirements

✅ **Google Gemini API Integration**: Core AI engine for intelligent summarization
✅ **Agentic Architecture**: Modular design with Planner, Executor, and Memory
✅ **ReAct Pattern**: Reasoning + Acting workflow demonstrated
✅ **Tool Integration**: YouTube Transcript API + Gemini API
✅ **Full Observability**: Complete memory logging of all agent decisions
✅ **Complete Documentation**: Architecture, explanation, and demo included

## 📋 Submission Checklist

- [x] All code in `src/` runs without errors
- [x] `ARCHITECTURE.md` contains a clear diagram sketch and explanation
- [x] `EXPLANATION.md` covers planning, tool use, memory, and limitations
- [ ] `DEMO.md` links to a 3–5 min video with timestamped highlights

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

1. **Planner** (`planner.py`) - Breaks down user goal into executable sub-tasks
2. **Executor** (`executor.py`) - Executes tasks using appropriate tools
3. **Memory** (`memory.py`) - Logs all agent activities and decisions

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Google Gemini API key ([Get one free](https://makersuite.google.com/app/apikey))


### Installation

1. **Install dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

2. **Set up your Gemini API key**
   ```powershell
   $env:GEMINI_API_KEY='your-gemini-api-key-here'
   ```

3. **Run the application**
   ```powershell
   cd src
   streamlit run app.py
   ```

## 📖 How It Works

### 1. Planning Phase (ReAct: Reasoning)
The **Planner** creates an execution plan with sub-tasks

### 2. Execution Phase (ReAct: Acting)
The **Executor** runs each task using external tools

### 3. Memory & Observability
The **Memory** component logs all agent decisions

## 📁 Project Structure

```
src/
├── planner.py              # Planning module
├── executor.py             # Execution module
├── memory.py               # Memory module
├── youtube_summarizer.py  # Main agent
└── app.py                  # Streamlit UI

ARCHITECTURE.md             # System design
EXPLANATION.md              # Technical explanation
DEMO.md                     # Video demo
```

## 📂 Folder Layout

![Folder Layout Diagram](images/folder-githb.png)



## 🏅 Judging Criteria

- **Technical Excellence **
  This criterion evaluates the robustness, functionality, and overall quality of the technical implementation. Judges will assess the code's efficiency, the absence of critical bugs, and the successful execution of the project's core features.

- **Solution Architecture & Documentation **
  This focuses on the clarity, maintainability, and thoughtful design of the project's architecture. This includes assessing the organization and readability of the codebase, as well as the comprehensiveness and conciseness of documentation (e.g., GitHub README, inline comments) that enables others to understand and potentially reproduce or extend the solution.

- **Innovative Gemini Integration **
  This criterion specifically assesses how effectively and creatively the Google Gemini API has been incorporated into the solution. Judges will look for novel applications, efficient use of Gemini's capabilities, and the impact it has on the project's functionality or user experience. You are welcome to use additional Google products.

- **Societal Impact & Novelty **
  This evaluates the project's potential to address a meaningful problem, contribute positively to society, or offer a genuinely innovative and unique solution. Judges will consider the originality of the idea, its potential real‑world applicability, and its ability to solve a challenge in a new or impactful way.


