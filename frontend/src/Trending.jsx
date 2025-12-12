import React, { useState, useEffect } from 'react';
import { TrendingUp, Play, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import axios from 'axios';
import './Trending.css';

const Trending = ({ onVideoSelect }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendingData, setTrendingData] = useState(null);

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
        setError('Failed to load trending podcasts');
      }
    } catch (err) {
      console.error('Error fetching trending:', err);
      let errorMessage = 'Failed to load trending podcasts';
      
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
            <h1>Trending Podcasts</h1>
          </div>
          <p className="subtitle">Powered by Gemini Search 🤖</p>
        </div>

        <div className="loading-state">
          <Loader2 className="spinner" size={48} />
          <p>Discovering trending podcasts with AI...</p>
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
            <h1>Trending Podcasts</h1>
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
          <h1>Trending Podcasts</h1>
          <Sparkles size={20} className="sparkle" />
        </div>
        <p className="subtitle">
          Top trending podcasts discovered using <strong>Gemini Search</strong> 🤖
        </p>
      </div>

      {/* Unified Grid (category rows + video cards share one grid system) */}
      <div className="trending-grid">
        {categories.map(([categoryId, categoryData], categoryIndex) => (
          <React.Fragment key={categoryId}>
            {/* Category Header Row (spans full grid) */}
            <div className={`category-row ${categoryIndex === 0 ? 'category-row--first' : ''}`}>
              <span className="category-icon">{categoryData.icon}</span>
              <h2 className="category-title">{categoryData.name}</h2>
              <div className="category-badge">
                <TrendingUp size={14} />
                Top {categoryData.videos.length}
              </div>
            </div>

            {/* Video Cards */}
            {categoryData.videos.length > 0 ? (
              categoryData.videos.map((video, index) => (
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
                <p>No trending videos found for this category</p>
              </div>
            )}
          </React.Fragment>
        ))}
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

