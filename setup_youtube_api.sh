#!/bin/bash

# Setup YouTube API Key for PodVibe.fm

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║              🔑 YouTube API Key Setup                                ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

cd src

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ .env file found"
    echo ""
    
    # Check if it has YOUTUBE_API_KEY
    if grep -q "YOUTUBE_API_KEY" .env; then
        echo "ℹ️  YOUTUBE_API_KEY already in .env"
        echo ""
        current_key=$(grep "YOUTUBE_API_KEY=" .env | cut -d'=' -f2)
        if [ -z "$current_key" ] || [ "$current_key" = "your_youtube_api_key_here" ]; then
            echo "⚠️  But it's not set to a real value yet."
            echo ""
        else
            echo "✅ YouTube API Key appears to be configured!"
            echo ""
            read -p "Do you want to update it? (y/N): " update
            if [[ ! $update =~ ^[Yy]$ ]]; then
                echo "Keeping existing configuration."
                exit 0
            fi
        fi
    fi
else
    echo "📝 Creating new .env file..."
    touch .env
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  HOW TO GET YOUTUBE API KEY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to: https://console.cloud.google.com/"
echo "2. Create/select a project"
echo "3. Enable 'YouTube Data API v3'"
echo "4. Create Credentials → API Key"
echo "5. Copy the API key"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Enter your YouTube API Key: " YOUTUBE_KEY

if [ -z "$YOUTUBE_KEY" ]; then
    echo ""
    echo "❌ No key entered. Exiting."
    exit 1
fi

# Check if GEMINI_API_KEY exists
if ! grep -q "GEMINI_API_KEY" .env; then
    echo ""
    read -p "Enter your Gemini API Key (required): " GEMINI_KEY
    
    cat > .env << EOF
# Google Gemini API Key (Required)
GEMINI_API_KEY=$GEMINI_KEY

# YouTube Data API Key (Optional - for real trending data)
YOUTUBE_API_KEY=$YOUTUBE_KEY
EOF
else
    # Just add/update YouTube API key
    if grep -q "YOUTUBE_API_KEY" .env; then
        # Update existing
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|YOUTUBE_API_KEY=.*|YOUTUBE_API_KEY=$YOUTUBE_KEY|" .env
        else
            sed -i "s|YOUTUBE_API_KEY=.*|YOUTUBE_API_KEY=$YOUTUBE_KEY|" .env
        fi
    else
        # Add new line
        echo "" >> .env
        echo "# YouTube Data API Key (Optional - for real trending data)" >> .env
        echo "YOUTUBE_API_KEY=$YOUTUBE_KEY" >> .env
    fi
fi

echo ""
echo "✅ YouTube API Key configured!"
echo ""
echo "🧪 Testing configuration..."
python3 << PYEOF
import os
from dotenv import load_dotenv
load_dotenv()
gemini = os.getenv('GEMINI_API_KEY')
youtube = os.getenv('YOUTUBE_API_KEY')
print(f"✅ GEMINI_API_KEY: {'Set' if gemini else 'Missing'}")
print(f"✅ YOUTUBE_API_KEY: {'Set' if youtube else 'Missing'}")
if youtube:
    print("\n🎉 You'll get REAL trending videos from YouTube!")
PYEOF

echo ""
echo "Start backend with: python3 api.py"
echo ""

