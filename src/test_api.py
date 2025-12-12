"""
Simple test script to verify the API is working
"""
import requests
import json

API_URL = "http://localhost:8000"

print("Testing PodVibe.fm API...\n")

# Test 1: Health Check
print("1. Testing health endpoint...")
try:
    response = requests.get(f"{API_URL}/api/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    print("   ✅ Health check passed!\n")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

# Test 2: Summarize Video
print("2. Testing summarize endpoint...")
test_url = "https://www.youtube.com/watch?v=aR20FWCCjAs"
try:
    print(f"   Sending request for: {test_url}")
    response = requests.post(
        f"{API_URL}/api/summarize",
        json={"url": test_url},
        timeout=120  # 2 minutes timeout
    )
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Summarize successful!")
        print(f"   Video ID: {data.get('video_id')}")
        print(f"   Summary length: {len(data.get('summary', ''))} characters")
        print(f"   Transcript length: {data.get('transcript_length')} characters")
        print(f"   Segments: {data.get('segments')}")
        print(f"   Keywords: {', '.join(data.get('keywords', []))}")
    else:
        print(f"   ❌ Error: {response.json()}")
except Exception as e:
    print(f"   ❌ Error: {e}\n")

print("\nTest complete!")
