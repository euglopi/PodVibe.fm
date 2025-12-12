import React, { useState, useEffect } from 'react';
import { TrendingUp, Play, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import axios from 'axios';
import './Trending.css';

const Trending = ({ onVideoSelect }) => {
  const MIN_PODCAST_SECONDS = 60;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendingData, setTrendingData] = useState(null);

  const parseDurationToSeconds = (input) => {
    if (input == null) return 0;
    if (typeof input === 'number' && Number.isFinite(input)) return Math.max(0, Math.floor(input));
    if (typeof input !== 'string') return 0;

    const raw = input.trim();
    if (!raw) return 0;

    // ISO-8601 durations like "PT1H2M3S"
    if (/^PT/i.test(raw)) {
      const h = raw.match(/(\d+)\s*H/i)?.[1];
      const m = raw.match(/(\d+)\s*M/i)?.[1];
      const s = raw.match(/(\d+)\s*S/i)?.[1];
      return (Number(h || 0) * 3600) + (Number(m || 0) * 60) + Number(s || 0);
    }

    // "1h 2m 3s" / "1 hr 2 min" style
    if (/[hms]/i.test(raw)) {
      const h = raw.match(/(\d+)\s*h/i)?.[1];
      const m = raw.match(/(\d+)\s*m/i)?.[1];
      const s = raw.match(/(\d+)\s*s/i)?.[1];
      return (Number(h || 0) * 3600) + (Number(m || 0) * 60) + Number(s || 0);
    }

    // "HH:MM:SS" or "MM:SS"
    if (/^\d+:\d{2}(:\d{2})?$/.test(raw)) {
      const parts = raw.split(':').map((p) => Number(p));
      if (parts.some((n) => Number.isNaN(n))) return 0;
      if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
      // MM:SS
      return (parts[0] * 60) + parts[1];
    }

    // plain numeric seconds in a string
    const asNum = Number(raw);
    if (Number.isFinite(asNum)) return Math.max(0, Math.floor(asNum));

    return 0;
  };

  const getDurationSeconds = (video) => {
    const direct = video?.durationSeconds;
    if (typeof direct === 'number' && Number.isFinite(direct)) return direct;
    if (typeof direct === 'string' && direct.trim() && Number.isFinite(Number(direct))) return Number(direct);

    // fallbacks some APIs use
    return parseDurationToSeconds(
      video?.duration ??
        video?.durationText ??
        video?.length ??
        video?.lengthText ??
        video?.contentDetails?.duration
    );
  };

  // const isPodcastTagged = (video) => {
  //   if (!video) return false;
  //   if (video.isPodcast === true) return true;

  //   const haystack = `${video.title || ''} ${video.description || ''} ${video.channel || ''}`.toLowerCase();
  //   return haystack.includes('podcast') || haystack.includes('#podcast') || haystack.includes('#podcasts');
  // };

  useEffect(() => {
    fetchTrendingPodcasts();
  }, []);

  const fetchTrendingPodcasts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/trending');

      if (response.data.success) {
        setTrendingData(response.data.categories);
      } else {
        setError('Failed to load trending videos');
      }
    } catch (err) {
      console.error('Error fetching trending:', err);
      let errorMessage = 'Failed to load trending videos';

      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to API server. Make sure the Flask API is running on http://localhost:8000';
      } else if (err.response) {
        errorMessage = err.response.data?.error || `Server error: ${err.response.status}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    // Navigate to summarizer with this video
    onVideoSelect(video.url);
  };

  if (loading) {
    return (
      <div className="trending-container">
        <div className="trending-header">
          <div className="header-title">
            <TrendingUp size={32} />
            <h1>trending videos</h1>
          </div>
          <p className="subtitle">Powered by Gemini Search 🤖</p>
        </div>

        <div className="loading-state">
          <Loader2 className="spinner" size={48} />
          <p>Discovering trending videos with AI...</p>
          <p className="loading-detail">This may take a moment as we search YouTube</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trending-container">
        <div className="trending-header">
          <div className="header-title">
            <TrendingUp size={32} />
            <h1>trending videos</h1>
          </div>
        </div>

        <div className="error-state">
          <AlertCircle size={48} />
          <h2>Oops!</h2>
          <p>{error}</p>
          <button onClick={fetchTrendingPodcasts} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const categories = trendingData ? Object.entries(trendingData) : [];

  return (
    <div className="trending-container">
      {/* Header */}
      <div className="trending-header">
        <div className="header-title">
          <TrendingUp size={32} />
          <h1>trending videos</h1>
          <Sparkles size={20} className="sparkle" />
        </div>
        <p className="subtitle">
          Top trending videos discovered using <strong>Gemini Search</strong> 🤖
        </p>
      </div>

      {/* Unified Grid (category rows + video cards share one grid system) */}
      <div className="trending-grid">
        {categories.map(([categoryId, categoryData], categoryIndex) => {
          const filteredVideos = (categoryData?.videos || []).filter((video) => {
            const durationSeconds = getDurationSeconds(video);
            return durationSeconds >= MIN_PODCAST_SECONDS;
          });

          return (
            <React.Fragment key={categoryId}>
            {/* Category Header Row (spans full grid) */}
            <div className={`category-row ${categoryIndex === 0 ? 'category-row--first' : ''}`}>
              <span className="category-icon">{categoryData.icon}</span>
              <h2 className="category-title">{categoryData.name}</h2>
              <div className="category-badge">
                <TrendingUp size={14} />
                Top {filteredVideos.length}
              </div>
            </div>

            {/* Video Cards */}
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video, index) => (
                <div
                  key={video.video_id || `${categoryId}-${index}`}
                  className="video-card video-card--compact"
                  onClick={() => handleVideoClick(video)}
                >
                  {/* Thumbnail */}
                  <div className="video-thumbnail">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/320x180?text=Video';
                      }}
                    />
                    <div className="play-overlay">
                      <div className="play-button">
                        <Play size={22} fill="white" />
                      </div>
                    </div>
                    <div className="video-rank">#{index + 1}</div>
                  </div>

                  {/* Compact Info */}
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-channel">{video.channel}</p>
                    <div className="video-meta">
                      <span className="ai-pill">
                        <Sparkles size={14} />
                        AI Summarize
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-videos">
                <p>No podcast episodes (≥ 1 hour) found for this category</p>
              </div>
            )}
          </React.Fragment>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="trending-footer">
        <p>
          <Sparkles size={16} />
          Results generated by Google Gemini AI • Updated in real-time
        </p>
      </div>
    </div>
  );
};

export default Trending;

