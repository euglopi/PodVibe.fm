# 🔑 YouTube API Setup Guide

Get **real trending videos** from YouTube instead of sample data!

---

## 📋 Quick Start (3 Steps)

### 1️⃣ Get YouTube API Key

**Go to:** https://console.cloud.google.com/

1. **Create a Project**
   - Click "Select a Project" → "New Project"
   - Name: "PodVibe" (or your choice)
   - Click "Create"

2. **Enable YouTube Data API v3**
   - Go to: https://console.cloud.google.com/apis/library
   - Search: "YouTube Data API v3"
   - Click it → Click "Enable"

3. **Create API Key**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "+ CREATE CREDENTIALS"
   - Select "API Key"
   - **Copy the key!** (looks like: `AIza...`)

4. **Optional: Restrict the Key** (recommended for security)
   - Click "Edit API Key"
   - Under "API restrictions" → "Restrict key"
   - Check only: "YouTube Data API v3"
   - Save

---

### 2️⃣ Configure Your Project

**Option A: Use the setup script (easiest)**

```bash
cd /Users/ishansingh/Downloads/PodVibe.fm
./setup_youtube_api.sh
```

**Option B: Manual setup**

Create `src/.env` file:

```bash
cd src
nano .env
```

Add your keys:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_key_here

# Optional: YouTube Data API Key (for real trending videos)
YOUTUBE_API_KEY=AIzaSy...your_youtube_key_here
```

---

### 3️⃣ Start the Backend

```bash
cd src
python3 api.py
```

You should see:
```
🚀 Starting PodVibe.fm API...
✅ GEMINI_API_KEY found
✅ Using YouTube Data API for real trending videos
* Running on http://0.0.0.0:8000
```

**Refresh your browser** → Real trending videos! 🎉

---

## 💰 API Quotas (Free Tier)

YouTube Data API v3 includes **10,000 quota units/day** for free:

| Action | Cost | Your Usage |
|--------|------|------------|
| Search request | 100 units | 400 units/page load |
| **Daily capacity** | - | **~25 page loads/day** |

Perfect for development and demos!

---

## ✅ What You Get

### With YouTube API Key:
- ✅ **Real trending videos** (updated live)
- ✅ Actual view counts and popularity
- ✅ Recent uploads (last 30 days)
- ✅ Accurate metadata and descriptions
- ✅ High-quality thumbnails

### Without YouTube API Key:
- ⚠️ Sample/demo data only
- Static videos (not updated)
- Still works for testing!

---

## 🔧 Troubleshooting

### "API key not valid" error

**Check:**
1. YouTube Data API v3 is enabled in your project
2. No typos in your API key
3. API key restrictions allow YouTube Data API v3

### "Quota exceeded" error

**You've used your daily quota (10,000 units).**

Solutions:
- Wait until tomorrow (quota resets at midnight Pacific Time)
- Request quota increase (if you need more)
- Backend automatically falls back to sample data

### Backend shows "using sample data"

**The API key isn't being detected.**

Check:
```bash
cd src
cat .env | grep YOUTUBE_API_KEY
```

Should show: `YOUTUBE_API_KEY=AIza...`

---

## 🎯 Testing Your Setup

```bash
# Test the trending endpoint
curl http://localhost:8000/api/trending

# Should return JSON with:
# - 4 categories
# - 3 videos each
# - Real YouTube video IDs
```

---

## 🚀 Next Steps

1. ✅ YouTube API configured
2. Start backend: `python3 api.py`
3. Open: http://localhost:3000
4. Browse real trending videos!
5. Click "AI Summarize" to get insights

---

## 📚 Additional Resources

- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)

---

**Questions?** Check the main README.md or create an issue on GitHub!

