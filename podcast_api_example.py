#!/usr/bin/env python3
"""
Download and transcribe NYT's "The Daily" podcast using Google Gemini API.

API Key Required:
    GOOGLE_API_KEY - Get from https://aistudio.google.com/apikey

Usage:
    # Transcribe latest episode
    GOOGLE_API_KEY='your-key' python podcast_api_example.py

    # Transcribe last 3 episodes
    GOOGLE_API_KEY='your-key' python podcast_api_example.py --episode-count 3

    # Use local Whisper instead (no API key needed)
    python podcast_api_example.py --engine whisper
"""
import argparse
import json
import os
import pathlib
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime
from email.utils import parsedate_to_datetime
from typing import List, Optional

import requests

# NYT The Daily RSS Feed
THE_DAILY_RSS = "https://feeds.simplecast.com/Sl5CSM3S"

# iTunes podcast namespace
ITUNES_NS = {"itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd"}


@dataclass
class Episode:
    """Podcast episode metadata."""
    title: str
    audio_url: str
    pub_date: datetime
    description: Optional[str] = None
    duration: Optional[str] = None
    guid: Optional[str] = None


def fetch_rss_feed(feed_url: str) -> ET.Element:
    """Fetch and parse RSS feed XML."""
    resp = requests.get(feed_url, timeout=30)
    resp.raise_for_status()
    return ET.fromstring(resp.content)


def parse_rss_date(date_str: str) -> datetime:
    """Parse RFC 822 date format used in RSS feeds."""
    try:
        return parsedate_to_datetime(date_str)
    except (ValueError, TypeError):
        return datetime.now()


def parse_episode(item: ET.Element) -> Optional[Episode]:
    """Parse an RSS <item> element into an Episode."""
    title = item.findtext("title", "Untitled")

    # Get audio URL from enclosure tag
    enclosure = item.find("enclosure")
    if enclosure is None:
        return None
    audio_url = enclosure.get("url")
    if not audio_url:
        return None

    pub_date_str = item.findtext("pubDate", "")
    pub_date = parse_rss_date(pub_date_str)

    description = item.findtext("description")
    duration = item.findtext("itunes:duration", namespaces=ITUNES_NS)
    guid = item.findtext("guid")

    return Episode(
        title=title,
        audio_url=audio_url,
        pub_date=pub_date,
        description=description,
        duration=duration,
        guid=guid,
    )


def get_episodes(feed_url: str, count: int = 1) -> List[Episode]:
    """Fetch the most recent episodes from an RSS feed."""
    root = fetch_rss_feed(feed_url)
    channel = root.find("channel")
    if channel is None:
        raise ValueError("Invalid RSS feed: no channel element")

    items = channel.findall("item")[:count]
    episodes = []
    for item in items:
        ep = parse_episode(item)
        if ep:
            episodes.append(ep)
    return episodes


def download_file(url: str, out_path: pathlib.Path) -> pathlib.Path:
    """Download a file with streaming to handle large podcast files."""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with requests.get(url, stream=True, timeout=120) as r:
        r.raise_for_status()
        with open(out_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    f.write(chunk)
    return out_path


def transcribe_with_gemini(audio_path: pathlib.Path) -> str:
    """
    Transcribe audio using Google Gemini API.

    Uses File API for files > 20MB (typical for podcasts).
    Requires GOOGLE_API_KEY environment variable.
    """
    import time
    from google import genai
    from google.genai import types
    from google.genai.errors import ClientError

    api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "GOOGLE_API_KEY or GEMINI_API_KEY environment variable required. "
            "Get one at https://aistudio.google.com/apikey"
        )

    client = genai.Client(api_key=api_key)

    file_size = audio_path.stat().st_size
    file_size_mb = file_size / (1024 * 1024)

    # Determine MIME type from extension
    suffix = audio_path.suffix.lower()
    mime_types = {
        ".mp3": "audio/mp3",
        ".wav": "audio/wav",
        ".m4a": "audio/mp4",
        ".aac": "audio/aac",
        ".ogg": "audio/ogg",
        ".flac": "audio/flac",
    }
    mime_type = mime_types.get(suffix, "audio/mpeg")

    prompt = (
        "Transcribe this audio completely and accurately. "
        "Output only the transcript text, with no timestamps, speaker labels, or annotations. "
        "Preserve natural paragraph breaks where appropriate."
    )

    # Models to try in order (fallback on rate limits)
    models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]

    uploaded_file = None
    if file_size_mb > 20:
        print(f"  Uploading {file_size_mb:.1f}MB to Gemini File API...")
        uploaded_file = client.files.upload(file=str(audio_path))

    last_error = None
    for model in models:
        for attempt in range(3):  # Retry up to 3 times per model
            try:
                if uploaded_file:
                    print(f"  Transcribing with {model} (this may take a few minutes)...")
                    response = client.models.generate_content(
                        model=model,
                        contents=[prompt, uploaded_file],
                    )
                else:
                    with open(audio_path, "rb") as f:
                        audio_bytes = f.read()
                    print(f"  Transcribing with {model}...")
                    response = client.models.generate_content(
                        model=model,
                        contents=[
                            prompt,
                            types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
                        ],
                    )

                # Clean up uploaded file on success
                if uploaded_file:
                    try:
                        client.files.delete(name=uploaded_file.name)
                    except Exception:
                        pass

                return response.text.strip()

            except ClientError as e:
                last_error = e
                if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                    # Extract retry delay from error if available
                    wait_time = 40 * (attempt + 1)  # 40s, 80s, 120s
                    print(f"  Rate limited. Waiting {wait_time}s before retry...")
                    time.sleep(wait_time)
                else:
                    raise  # Re-raise non-rate-limit errors

        print(f"  Model {model} exhausted, trying next...")

    # Clean up on failure
    if uploaded_file:
        try:
            client.files.delete(name=uploaded_file.name)
        except Exception:
            pass

    raise last_error or RuntimeError("All Gemini models failed")


def transcribe_with_faster_whisper(audio_path: pathlib.Path) -> str:
    """
    Transcribe audio using local faster-whisper model.

    Runs offline, no API key needed.
    Requires: pip install faster-whisper
    """
    from faster_whisper import WhisperModel

    print("  Loading Whisper model...")
    model = WhisperModel("base", device="cpu", compute_type="int8")

    print("  Transcribing (this may take a while)...")
    segments, _info = model.transcribe(str(audio_path))
    text_parts = [seg.text for seg in segments]
    return "".join(text_parts).strip()


def make_safe_filename(title: str, max_length: int = 80) -> str:
    """Convert a title to a safe filename."""
    safe = "".join(c for c in title if c.isalnum() or c in (" ", "_", "-"))
    safe = safe.strip().replace(" ", "_")
    return safe[:max_length]


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Download and transcribe NYT's The Daily podcast",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--episode-count",
        type=int,
        default=1,
        help="Number of recent episodes to process (default: 1)",
    )
    parser.add_argument(
        "--engine",
        choices=["gemini", "whisper"],
        default="gemini",
        help="Transcription engine (default: gemini)",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="podcasts_out",
        help="Output directory for transcripts (default: podcasts_out)",
    )
    parser.add_argument(
        "--keep-audio",
        action="store_true",
        help="Keep audio files after transcription (default: delete)",
    )
    args = parser.parse_args()

    print(f"Fetching RSS feed from The Daily...")
    episodes = get_episodes(THE_DAILY_RSS, count=args.episode_count)

    if not episodes:
        print("No episodes found!")
        return

    print(f"Found {len(episodes)} episode(s)\n")

    out_dir = pathlib.Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    for i, episode in enumerate(episodes, 1):
        print(f"[{i}/{len(episodes)}] {episode.title}")
        print(f"  Published: {episode.pub_date.strftime('%Y-%m-%d')}")
        if episode.duration:
            print(f"  Duration: {episode.duration}")

        safe_name = make_safe_filename(episode.title)
        audio_path = out_dir / f"{safe_name}.mp3"
        output_file = out_dir / f"{safe_name}.json"

        # Skip if already processed
        if output_file.exists():
            print(f"  Already processed, skipping...")
            continue

        # Download audio
        print(f"  Downloading audio...")
        download_file(episode.audio_url, audio_path)
        file_size_mb = audio_path.stat().st_size / (1024 * 1024)
        print(f"  Downloaded {file_size_mb:.1f}MB")

        # Transcribe
        if args.engine == "gemini":
            transcript = transcribe_with_gemini(audio_path)
        else:
            transcript = transcribe_with_faster_whisper(audio_path)

        # Save output
        meta = {
            "title": episode.title,
            "source": "NYT The Daily",
            "feed_url": THE_DAILY_RSS,
            "pub_date": episode.pub_date.isoformat(),
            "duration": episode.duration,
            "audio_url": episode.audio_url,
            "transcription_engine": args.engine,
            "transcript": transcript,
        }

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)

        print(f"  Saved: {output_file}")

        # Clean up audio unless --keep-audio
        if not args.keep_audio and audio_path.exists():
            audio_path.unlink()
            print("  Deleted audio file")

        print()

    print("Done!")


if __name__ == "__main__":
    main()
