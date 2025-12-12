# YouTube Podcast Summarizer - React UI

Modern, responsive React frontend for the YouTube Podcast Summarizer with Agentic AI.

## Features

- 🎨 Beautiful gradient UI with smooth animations
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Real-time processing status updates
- 📊 Statistics and metrics display
- 💾 Download summaries as JSON
- 🧠 Visualizes Agentic AI architecture (Planner, Executor, Memory)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library
- **CSS3** - Custom styling with gradients and animations

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Step 1: Start the Python Backend API

In the `src` directory:

```bash
# Install Flask dependencies first
pip install flask flask-cors

# Start the API server
python api.py
```

The API will run on `http://localhost:8000`

### Step 2: Start the React Frontend

In the `frontend` directory:

```bash
npm run dev
```

The React app will run on `http://localhost:3000`

### Step 3: Use the Application

1. Open your browser to `http://localhost:3000`
2. Enter a YouTube podcast URL
3. Click "Summarize"
4. Watch the AI process your request in real-time
5. View the comprehensive summary and download as JSON

## API Endpoints

The React app connects to these backend endpoints:

- `POST /api/summarize` - Process YouTube video and generate summary
- `GET /api/health` - Check API health status
- `GET /api/models` - List available Gemini models

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # Styling
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## Environment Variables

Make sure your `.env` file in the parent directory contains:

```
GEMINI_API_KEY=your_api_key_here
```

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure:
1. The Flask API is running with `flask-cors` installed
2. The proxy configuration in `vite.config.js` is correct

### API Connection Failed
Ensure:
1. The Flask API is running on port 8000
2. Your `GEMINI_API_KEY` is set in the `.env` file
3. All Python dependencies are installed

### Port Already in Use
If port 3000 or 8000 is in use:
```bash
# Change the port in vite.config.js for frontend
# Change the port in api.py for backend
```

## Screenshots

### Main Interface
Clean, modern interface with YouTube URL input

### Processing View
Real-time status updates showing AI agent progress

### Results Display
Comprehensive summary with statistics and architecture visualization

## Contributing

This project is part of the Agentic AI Hackathon submission.

## License

MIT License - See LICENSE file for details
