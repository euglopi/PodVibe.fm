import { useState, useRef, useEffect } from "react";
import type { Clip } from "../types/content";

interface MediaPlayerProps {
  clip: Clip;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export function MediaPlayer({ clip, onNext, onPrevious, hasNext, hasPrevious }: MediaPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(clip.duration);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // Reset state when clip changes
    setCurrentTime(0);
    setIsPlaying(false);
    setDuration(clip.duration);
  }, [clip.id]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Handle autoplay restrictions
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || clip.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gray-900 text-white rounded-3xl p-8 max-w-md mx-auto">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={clip.mediaUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          if (hasNext && onNext) onNext();
        }}
      />

      {/* Artwork */}
      <div className="aspect-square bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl mb-6 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">
            {clip.mediaType === "video" ? "🎬" : "🎧"}
          </div>
          <p className="text-white/80 text-sm">{clip.showTitle}</p>
        </div>
      </div>

      {/* Track Info */}
      <div className="mb-6 text-center">
        <h2 className="font-semibold text-lg mb-1 line-clamp-2">{clip.title}</h2>
        <p className="text-gray-400 text-sm">{clip.host}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        {/* Previous */}
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>

        {/* Skip Back 15s */}
        <button
          onClick={skipBackward}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="w-16 h-16 bg-white text-gray-900 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Skip Forward 15s */}
        <button
          onClick={skipForward}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
          </svg>
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 justify-center">
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
        </svg>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
        />
      </div>

      {/* Insight Details */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <p className="text-purple-400 text-sm font-medium mb-2">{clip.claim}</p>
        <blockquote className="text-gray-400 text-sm italic">"{clip.quote}"</blockquote>
        <div className="flex flex-wrap gap-2 mt-4">
          {clip.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
