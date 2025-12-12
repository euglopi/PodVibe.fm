#!/usr/bin/env bun
/**
 * FFmpeg Clip Splicer for PodVibe.fm
 *
 * Generates FFmpeg commands to extract audio/video clips based on
 * transcript timestamps. Supports keyword search, speaker filtering,
 * and direct timestamp ranges.
 *
 * Usage:
 *   bun run src/utils/clip-splicer.ts --help
 */

import { readFileSync, existsSync } from 'fs';
import type { Transcript, TranscriptSegment, ClipOptions, Insight, TimeRange } from '../types/transcript';

// ============================================================================
// Transcript Parsing
// ============================================================================

export function parseTranscript(jsonPath: string): Transcript {
  if (!existsSync(jsonPath)) {
    throw new Error(`Transcript file not found: ${jsonPath}`);
  }

  const content = readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(content);

  // Handle different transcript formats
  if (Array.isArray(data)) {
    // Direct array of segments
    return { segments: normalizeSegments(data) };
  } else if (data.segments) {
    // Object with segments property
    return {
      ...data,
      segments: normalizeSegments(data.segments),
    };
  } else if (data.results || data.utterances) {
    // Google Speech-to-Text or similar format
    const segments = data.results || data.utterances;
    return { segments: normalizeSegments(segments) };
  }

  throw new Error('Unrecognized transcript format');
}

function normalizeSegments(segments: unknown[]): TranscriptSegment[] {
  return segments.map((seg: any) => ({
    text: seg.text || seg.transcript || seg.content || '',
    start: parseTime(seg.start || seg.start_time || seg.startTime || 0),
    end: parseTime(seg.end || seg.end_time || seg.endTime || 0),
    speaker: seg.speaker || seg.speaker_label || seg.speakerId,
    confidence: seg.confidence,
  }));
}

function parseTime(time: number | string): number {
  if (typeof time === 'number') return time;
  // Handle "1:30.5" or "90.5s" formats
  if (typeof time === 'string') {
    if (time.endsWith('s')) {
      return parseFloat(time.slice(0, -1));
    }
    if (time.includes(':')) {
      const parts = time.split(':').map(parseFloat);
      if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
    }
    return parseFloat(time);
  }
  return 0;
}

// ============================================================================
// Segment Search Functions
// ============================================================================

export function findSegmentsByKeyword(
  transcript: Transcript,
  keywords: string[],
  caseSensitive = false
): TranscriptSegment[] {
  const normalizedKeywords = caseSensitive
    ? keywords
    : keywords.map(k => k.toLowerCase());

  return transcript.segments.filter(segment => {
    const text = caseSensitive ? segment.text : segment.text.toLowerCase();
    return normalizedKeywords.some(keyword => text.includes(keyword));
  });
}

export function findSegmentsBySpeaker(
  transcript: Transcript,
  speaker: string
): TranscriptSegment[] {
  return transcript.segments.filter(
    segment => segment.speaker?.toLowerCase() === speaker.toLowerCase()
  );
}

export function findSegmentsByTimeRange(
  transcript: Transcript,
  start: number,
  end: number
): TranscriptSegment[] {
  return transcript.segments.filter(
    segment => segment.start >= start && segment.end <= end
  );
}

// ============================================================================
// Boundary Expansion
// ============================================================================

export function expandToNaturalBoundaries(
  selectedSegments: TranscriptSegment[],
  allSegments: TranscriptSegment[],
  options: { paddingSeconds?: number; expandToSpeakerTurn?: boolean } = {}
): TimeRange {
  const { paddingSeconds = 0.5, expandToSpeakerTurn = true } = options;

  if (selectedSegments.length === 0) {
    throw new Error('No segments selected');
  }

  let start = Math.min(...selectedSegments.map(s => s.start));
  let end = Math.max(...selectedSegments.map(s => s.end));

  if (expandToSpeakerTurn) {
    // Find the speaker of the first selected segment
    const firstSpeaker = selectedSegments[0].speaker;
    const lastSpeaker = selectedSegments[selectedSegments.length - 1].speaker;

    // Expand start to beginning of speaker's turn
    if (firstSpeaker) {
      const startIdx = allSegments.findIndex(s => s.start === selectedSegments[0].start);
      for (let i = startIdx - 1; i >= 0; i--) {
        if (allSegments[i].speaker === firstSpeaker) {
          start = allSegments[i].start;
        } else {
          break;
        }
      }
    }

    // Expand end to end of speaker's turn
    if (lastSpeaker) {
      const endIdx = allSegments.findIndex(
        s => s.end === selectedSegments[selectedSegments.length - 1].end
      );
      for (let i = endIdx + 1; i < allSegments.length; i++) {
        if (allSegments[i].speaker === lastSpeaker) {
          end = allSegments[i].end;
        } else {
          break;
        }
      }
    }
  }

  // Apply padding
  start = Math.max(0, start - paddingSeconds);
  end = end + paddingSeconds;

  return { start, end };
}

export function mergeOverlappingRanges(ranges: TimeRange[], gapThreshold = 2): TimeRange[] {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: TimeRange[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.start <= last.end + gapThreshold) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

// ============================================================================
// FFmpeg Command Generation
// ============================================================================

export function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toFixed(3).padStart(6, '0')}`;
  }
  return `${m}:${s.toFixed(3).padStart(6, '0')}`;
}

export function generateFFmpegCommand(options: ClipOptions): string {
  const {
    inputPath,
    outputPath,
    start,
    end,
    codec = 'copy',
    fadeIn,
    fadeOut,
  } = options;

  const duration = end - start;
  const parts: string[] = ['ffmpeg', '-y'];

  // Input seeking (before -i for faster seeking with -c copy)
  if (codec === 'copy') {
    parts.push(`-ss ${formatTimestamp(start)}`);
  }

  parts.push(`-i "${inputPath}"`);

  // Output seeking (after -i for frame-accurate seeking with re-encode)
  if (codec !== 'copy') {
    parts.push(`-ss ${formatTimestamp(start)}`);
  }

  parts.push(`-to ${formatTimestamp(end)}`);

  // Audio filters for fade effects
  if (fadeIn || fadeOut) {
    const filters: string[] = [];
    if (fadeIn) {
      filters.push(`afade=t=in:st=0:d=${fadeIn}`);
    }
    if (fadeOut) {
      const fadeOutStart = duration - fadeOut;
      filters.push(`afade=t=out:st=${fadeOutStart}:d=${fadeOut}`);
    }
    parts.push(`-af "${filters.join(',')}"`);
  }

  // Codec settings
  if (codec === 'copy') {
    parts.push('-c copy');
  } else {
    // Re-encode with good quality
    const ext = outputPath.split('.').pop()?.toLowerCase();
    if (ext === 'mp3') {
      parts.push('-c:a libmp3lame -q:a 2');
    } else if (ext === 'aac' || ext === 'm4a') {
      parts.push('-c:a aac -b:a 192k');
    } else if (ext === 'wav') {
      parts.push('-c:a pcm_s16le');
    } else if (ext === 'mp4') {
      parts.push('-c:v copy -c:a aac -b:a 192k');
    }
  }

  parts.push(`"${outputPath}"`);

  return parts.join(' ');
}

export function generateMultiClipCommand(
  inputPath: string,
  ranges: TimeRange[],
  outputPattern: string,
  options: Partial<ClipOptions> = {}
): string[] {
  return ranges.map((range, i) => {
    const outputPath = outputPattern.replace('%d', String(i + 1).padStart(3, '0'));
    return generateFFmpegCommand({
      inputPath,
      outputPath,
      start: range.start,
      end: range.end,
      ...options,
    });
  });
}

// ============================================================================
// Insight Integration (for future LLM use)
// ============================================================================

export function clipFromInsight(
  mediaPath: string,
  insight: Insight,
  options: Partial<ClipOptions> = {}
): string {
  const outputPath = options.outputPath ||
    mediaPath.replace(/\.[^.]+$/, `_clip_${insight.timestamp_start.toFixed(0)}.mp3`);

  return generateFFmpegCommand({
    inputPath: mediaPath,
    outputPath,
    start: insight.timestamp_start,
    end: insight.timestamp_end,
    ...options,
  });
}

export function clipsFromInsights(
  mediaPath: string,
  insights: Insight[],
  outputDir: string,
  options: Partial<ClipOptions> = {}
): string[] {
  return insights.map((insight, i) => {
    const filename = `clip_${String(i + 1).padStart(3, '0')}_${insight.timestamp_start.toFixed(0)}s.mp3`;
    const outputPath = `${outputDir}/${filename}`;
    return clipFromInsight(mediaPath, insight, { ...options, outputPath });
  });
}

// ============================================================================
// CLI
// ============================================================================

interface CliArgs {
  input?: string;
  transcript?: string;
  output?: string;
  start?: number;
  end?: number;
  keywords?: string[];
  speaker?: string;
  padding?: number;
  codec?: 'copy' | 'reencode';
  fadeIn?: number;
  fadeOut?: number;
  dryRun?: boolean;
  help?: boolean;
}

function parseArgs(args: string[]): CliArgs {
  const result: CliArgs = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--input':
      case '-i':
        result.input = next;
        i++;
        break;
      case '--transcript':
      case '-t':
        result.transcript = next;
        i++;
        break;
      case '--output':
      case '-o':
        result.output = next;
        i++;
        break;
      case '--start':
      case '-s':
        result.start = parseFloat(next);
        i++;
        break;
      case '--end':
      case '-e':
        result.end = parseFloat(next);
        i++;
        break;
      case '--keywords':
      case '-k':
        result.keywords = next.split(',').map(k => k.trim());
        i++;
        break;
      case '--speaker':
        result.speaker = next;
        i++;
        break;
      case '--padding':
      case '-p':
        result.padding = parseFloat(next);
        i++;
        break;
      case '--codec':
      case '-c':
        result.codec = next as 'copy' | 'reencode';
        i++;
        break;
      case '--fade-in':
        result.fadeIn = parseFloat(next);
        i++;
        break;
      case '--fade-out':
        result.fadeOut = parseFloat(next);
        i++;
        break;
      case '--dry-run':
      case '-n':
        result.dryRun = true;
        break;
      case '--help':
      case '-h':
        result.help = true;
        break;
    }
  }

  return result;
}

function printHelp(): void {
  console.log(`
FFmpeg Clip Splicer - Extract audio/video clips from transcripts

USAGE:
  bun run src/utils/clip-splicer.ts [OPTIONS]

OPTIONS:
  -i, --input <path>       Input media file (required)
  -t, --transcript <path>  Transcript JSON file (required for keyword/speaker search)
  -o, --output <path>      Output file path (default: input_clip.mp3)

  SELECTION (choose one):
  -s, --start <seconds>    Start time in seconds
  -e, --end <seconds>      End time in seconds
  -k, --keywords <list>    Comma-separated keywords to search for
      --speaker <name>     Filter by speaker name

  PROCESSING:
  -p, --padding <seconds>  Add padding around clip boundaries (default: 0.5)
  -c, --codec <type>       'copy' (fast) or 'reencode' (precise) (default: copy)
      --fade-in <seconds>  Fade in duration
      --fade-out <seconds> Fade out duration

  OUTPUT:
  -n, --dry-run            Print FFmpeg command without executing
  -h, --help               Show this help message

EXAMPLES:
  # Extract by timestamp range
  bun run src/utils/clip-splicer.ts -i podcast.mp3 -s 120.5 -e 185.2 -o clip.mp3

  # Extract by keyword search
  bun run src/utils/clip-splicer.ts -i podcast.mp3 -t transcript.json -k "AI,machine learning" -o clip.mp3

  # Extract by speaker with fade
  bun run src/utils/clip-splicer.ts -i podcast.mp3 -t transcript.json --speaker "Speaker 1" --fade-in 0.5 --fade-out 0.5

  # Dry run (print command only)
  bun run src/utils/clip-splicer.ts -i podcast.mp3 -s 120 -e 180 --dry-run
`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || process.argv.length <= 2) {
    printHelp();
    process.exit(0);
  }

  if (!args.input) {
    console.error('Error: --input is required');
    process.exit(1);
  }

  let start: number;
  let end: number;

  // Determine clip boundaries
  if (args.start !== undefined && args.end !== undefined) {
    // Direct timestamp mode
    start = args.start;
    end = args.end;
  } else if (args.transcript && (args.keywords || args.speaker)) {
    // Search mode
    const transcript = parseTranscript(args.transcript);
    let segments: TranscriptSegment[];

    if (args.keywords) {
      segments = findSegmentsByKeyword(transcript, args.keywords);
      if (segments.length === 0) {
        console.error(`No segments found matching keywords: ${args.keywords.join(', ')}`);
        process.exit(1);
      }
      console.log(`Found ${segments.length} segment(s) matching keywords`);
    } else if (args.speaker) {
      segments = findSegmentsBySpeaker(transcript, args.speaker);
      if (segments.length === 0) {
        console.error(`No segments found for speaker: ${args.speaker}`);
        process.exit(1);
      }
      console.log(`Found ${segments.length} segment(s) from speaker: ${args.speaker}`);
    } else {
      console.error('Error: Must specify --start/--end, --keywords, or --speaker');
      process.exit(1);
    }

    const range = expandToNaturalBoundaries(segments, transcript.segments, {
      paddingSeconds: args.padding ?? 0.5,
    });
    start = range.start;
    end = range.end;

    console.log(`Expanded to time range: ${formatTimestamp(start)} - ${formatTimestamp(end)}`);
  } else {
    console.error('Error: Must specify --start/--end, or --transcript with --keywords/--speaker');
    process.exit(1);
  }

  // Generate output path if not specified
  const output = args.output || args.input.replace(/\.[^.]+$/, '_clip.mp3');

  // Generate FFmpeg command
  const command = generateFFmpegCommand({
    inputPath: args.input,
    outputPath: output,
    start,
    end,
    codec: args.codec,
    fadeIn: args.fadeIn,
    fadeOut: args.fadeOut,
  });

  if (args.dryRun) {
    console.log('\nFFmpeg command:');
    console.log(command);
  } else {
    console.log(`\nExecuting: ${command}\n`);
    const proc = Bun.spawn(['sh', '-c', command], {
      stdout: 'inherit',
      stderr: 'inherit',
    });
    const exitCode = await proc.exited;
    if (exitCode !== 0) {
      console.error(`FFmpeg exited with code ${exitCode}`);
      process.exit(exitCode);
    }
    console.log(`\nClip saved to: ${output}`);
  }
}

// Run CLI if this is the main module
if (import.meta.main) {
  main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
