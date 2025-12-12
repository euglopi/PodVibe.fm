#!/bin/bash

# Quick start script - Sets up and runs both frontend and backend

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║              🚀 PodVibe.fm - Quick Start                             ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Check for .env file
if [ ! -f "src/.env" ]; then
    echo "⚠️  No .env file found!"
    echo ""
    echo "You need to set up your API keys first:"
    echo "  1. Run: ./setup_youtube_api.sh"
    echo "  OR"
    echo "  2. Manually create src/.env with:"
    echo "     GEMINI_API_KEY=your_key"
    echo "     YOUTUBE_API_KEY=your_key"
    echo ""
    exit 1
fi

# Load environment variables
source src/.env 2>/dev/null || true

echo "✅ Configuration found"
echo ""
echo "Starting services..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will start:"
echo "  • Backend API on http://localhost:8000"
echo "  • Frontend UI on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Start backend
echo "🔧 Starting backend..."
cd src
export GEMINI_API_KEY=$GEMINI_API_KEY
export YOUTUBE_API_KEY=$YOUTUBE_API_KEY
python3 api.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

sleep 3

echo ""
echo "✅ Services started!"
echo ""
echo "📡 Backend: http://localhost:8000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Logs:"
echo "  Backend: tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Wait for services
wait

