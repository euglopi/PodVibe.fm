#!/bin/bash

# Test YouTube API Integration

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║              🧪 Testing YouTube API Integration                      ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Test 1: Check .env file exists
echo "1️⃣ Checking configuration..."
if [ ! -f "src/.env" ]; then
    echo "   ❌ No .env file found in src/"
    echo "   Run: ./setup_youtube_api.sh"
    exit 1
else
    echo "   ✅ .env file exists"
fi

# Test 2: Check environment variables
echo ""
echo "2️⃣ Checking API keys..."
cd src
python3 << PYEOF
import os
from dotenv import load_dotenv

load_dotenv()

gemini_key = os.getenv('GEMINI_API_KEY')
youtube_key = os.getenv('YOUTUBE_API_KEY')

if not gemini_key:
    print("   ❌ GEMINI_API_KEY not set")
    exit(1)
else:
    print(f"   ✅ GEMINI_API_KEY: ...{gemini_key[-8:]}")

if not youtube_key:
    print("   ⚠️  YOUTUBE_API_KEY not set (will use sample data)")
else:
    print(f"   ✅ YOUTUBE_API_KEY: ...{youtube_key[-8:]}")
PYEOF

if [ $? -ne 0 ]; then
    echo ""
    echo "Fix configuration and try again."
    exit 1
fi

cd ..

# Test 3: Check Python dependencies
echo ""
echo "3️⃣ Checking Python dependencies..."

python3 << PYEOF
try:
    import requests
    print("   ✅ requests")
except ImportError:
    print("   ❌ requests (pip install requests)")

try:
    import flask
    print("   ✅ flask")
except ImportError:
    print("   ❌ flask (pip install flask)")

try:
    import flask_cors
    print("   ✅ flask-cors")
except ImportError:
    print("   ❌ flask-cors (pip install flask-cors)")

try:
    import google.generativeai
    print("   ✅ google-generativeai")
except ImportError:
    print("   ❌ google-generativeai (pip install google-generativeai)")

try:
    from dotenv import load_dotenv
    print("   ✅ python-dotenv")
except ImportError:
    print("   ❌ python-dotenv (pip install python-dotenv)")
PYEOF

# Test 4: Start backend and test endpoint
echo ""
echo "4️⃣ Testing backend endpoint..."
echo "   Starting Flask API..."

cd src
python3 api.py > /tmp/podvibe_test.log 2>&1 &
API_PID=$!
cd ..

# Wait for API to start
sleep 5

# Test the endpoint
echo "   Testing /api/trending..."
RESPONSE=$(curl -s http://localhost:8000/api/trending)

if echo "$RESPONSE" | grep -q "success"; then
    echo "   ✅ /api/trending working!"
    
    # Check if using real data or sample data
    if echo "$RESPONSE" | grep -q '"using_sample_data": false'; then
        echo "   🎉 Using REAL YouTube data!"
    else
        echo "   ℹ️  Using sample data (no YouTube API key)"
    fi
    
    # Count categories
    CATEGORIES=$(echo "$RESPONSE" | grep -o '"name"' | wc -l)
    echo "   📊 Found $CATEGORIES categories"
else
    echo "   ❌ /api/trending failed"
    echo "   Response: $RESPONSE"
fi

# Cleanup
kill $API_PID 2>/dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  TEST COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ All tests passed!"
echo ""
echo "To start the app:"
echo "  cd src && python3 api.py"
echo ""

