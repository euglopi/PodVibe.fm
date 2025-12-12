/**
 * Transcript types for PodVibe.fm clip splicer
 * Compatible with Google Speech-to-Text / Gemini output format
 */

export interface TranscriptSegment {
  text: string;
  start: number;  // seconds
  end: number;    // seconds
  speaker?: string;
  confidence?: number;
}

export interface Transcript {
  segments: TranscriptSegment[];
  duration?: number;  // total duration in seconds
  language?: string;
  source?: string;    // e.g., "gemini", "whisper"
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface ClipOptions {
  inputPath: string;
  outputPath: string;
  start: number;
  end: number;
  codec?: 'copy' | 'reencode';
  fadeIn?: number;   // seconds
  fadeOut?: number;  // seconds
  format?: 'mp3' | 'wav' | 'mp4' | 'aac';
}

/**
 * Insight object for future LLM integration
 * Matches the schema from idea-guy-overview
 */
export interface Insight {
  claim: string;
  why_it_matters: string;
  evidence: string;           // verbatim quote from transcript
  who_said_it?: string;
  timestamp_start: number;
  timestamp_end: number;
  tags?: string[];
  actionability_score?: number;
  novelty_score?: number;
  clipability_score?: number;
}
