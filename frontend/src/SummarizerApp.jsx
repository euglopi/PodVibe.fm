import React, { useState } from 'react';
import { Youtube, Brain, Zap, Clock, CheckCircle, AlertCircle, Loader2, FileText, Download, Home, TrendingUp } from 'lucide-react';
import axios from 'axios';
import Trending from './Trending';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [currentPage, setCurrentPage] = useState('trending'); // 'trending' or 'summarizer'

  const getYouTubeVideoId = (inputUrl) => {
    if (!inputUrl) return null;
    try {
      const urlObj = new URL(inputUrl);
      // Standard watch URL
      if (urlObj.hostname.includes('youtube.com')) {
        // e.g. https://www.youtube.com/watch?v=VIDEOID
        const vParam = urlObj.searchParams.get('v');
        if (vParam) return vParam;
        // e.g. https://www.youtube.com/embed/VIDEOID
        const parts = urlObj.pathname.split('/');
        const embedIndex = parts.indexOf('embed');
        if (embedIndex !== -1 && parts[embedIndex + 1]) return parts[embedIndex + 1];
        // e.g. https://www.youtube.com/shorts/VIDEOID
        const shortsIndex = parts.indexOf('shorts');
        if (shortsIndex !== -1 && parts[shortsIndex + 1]) return parts[shortsIndex + 1];
      }
      // youtu.be short link: https://youtu.be/VIDEOID
      if (urlObj.hostname === 'youtu.be') {
        const parts = urlObj.pathname.split('/').filter(Boolean);
        if (parts[0]) return parts[0];
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentStep('Initializing...');

    try {
      // Call the backend API
      const response = await axios.post('/api/summarize', {
        url: url.trim()
      });

      setResult(response.data);
      setCurrentStep('Complete!');
    } catch (err) {
      console.error('API Error:', err);
      let errorMessage = 'Failed to process video. Please try again.';
      
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to API server. Make sure the Flask API is running on http://localhost:8000';
      } else if (err.response) {
        errorMessage = err.response.data?.error || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Check if API is running.';
      }
      
      setError(errorMessage);
      setCurrentStep(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (videoUrl) => {
    // When user clicks a video from trending, switch to summarizer and set URL
    setUrl(videoUrl);
    setCurrentPage('summarizer');
    setResult(null);
    setError(null);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadSummary = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `summary_${result.video_id || 'download'}.json`;
    link.click();
  };

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-content">
          <div className="nav-logo">
            <Youtube className="icon" />
            <span className="logo-text">PodVibe.fm</span>
          </div>
          <div className="nav-links">
            <button 
              className={`nav-link ${currentPage === 'trending' ? 'active' : ''}`}
              onClick={() => setCurrentPage('trending')}
            >
              <TrendingUp size={18} />
              Trending
            </button>
            <button 
              className={`nav-link ${currentPage === 'summarizer' ? 'active' : ''}`}
              onClick={() => setCurrentPage('summarizer')}
            >
              <Brain size={18} />
              AI Summarizer
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Trending Page */}
        {currentPage === 'trending' && (
          <Trending onVideoSelect={handleVideoSelect} />
        )}

        {/* Summarizer Page */}
        {currentPage === 'summarizer' && (
          <>
            {/* Header */}
            <header className="header">
              <div className="logo">
                <Brain className="icon-large" />
                <h1>AI-Powered Podcast Summarizer</h1>
              </div>
              <p className="subtitle">Powered by Google Gemini & Agentic AI</p>
            </header>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="input-section">
              <div className="input-group">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter YouTube podcast URL (e.g., https://www.youtube.com/watch?v=...)"
                  className="url-input"
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="icon-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="icon" />
                      Summarize
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Media Player */}
            {url && (
              <div className="player-section" style={{ marginTop: '16px' }}>
                {getYouTubeVideoId(url) ? (
                  <div className="player-wrapper" style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe
                      title="YouTube player"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(url)}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    />
                  </div>
                ) : (
                  <div className="alert alert-error">
                    <AlertCircle className="icon" />
                    <span>Invalid YouTube URL. Please check and try again.</span>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <AlertCircle className="icon" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading Status */}
            {loading && (
              <div className="status-card">
                <div className="status-header">
                  <Brain className="icon-pulse" />
                  <h3>Processing Your Request</h3>
                </div>
                <div className="progress-steps">
                  <div className="step active">
                    <CheckCircle className="icon" />
                    <span>Planning execution</span>
                  </div>
                  <div className="step active">
                    <CheckCircle className="icon" />
                    <span>Extracting video ID</span>
                  </div>
                  <div className="step active">
                    <Loader2 className="icon-spin" />
                    <span>Fetching transcript</span>
                  </div>
                  <div className="step">
                    <Clock className="icon" />
                    <span>Generating AI summary</span>
                  </div>
                  <div className="step">
                    <Clock className="icon" />
                    <span>Extracting semantic keywords</span>
                  </div>
                </div>
                <p className="status-message">{currentStep}</p>
              </div>
            )}

            {/* Results */}
            {result && !loading && (
              <div className="results">
                {/* Summary Card */}
                <div className="result-card">
                  <div className="card-header">
                    <div className="header-left">
                      <FileText className="icon" />
                      <h2>AI-Generated Summary</h2>
                    </div>
                    <button onClick={downloadSummary} className="download-btn">
                      <Download className="icon" />
                      Download JSON
                    </button>
                  </div>
                  <div className="summary-content">
                    <div className="video-info">
                      <span className="video-id">Video ID: {result.video_id}</span>
                      <span className="timestamp">
                        <Clock className="icon-small" />
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="summary-text">
                      {result.summary}
                    </div>
                    
                    {/* Keywords Section */}
                    {result.keywords && result.keywords.length > 0 && (
                      <div className="keywords-section">
                        <h3>🏷️ Semantic Keywords</h3>
                        <div className="keywords-container">
                          {result.keywords.map((keyword, index) => (
                            <span key={index} className="keyword-tag">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Card */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FileText />
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{result.transcript_length?.toLocaleString() || 'N/A'}</span>
                      <span className="stat-label">Characters</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Brain />
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{result.segments || 'N/A'}</span>
                      <span className="stat-label">Segments</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <CheckCircle />
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">5/5</span>
                      <span className="stat-label">Tasks Completed</span>
                    </div>
                  </div>
                </div>

                {/* Architecture Info */}
                <div className="architecture-card">
                  <h3>
                    <Zap className="icon" />
                    Agentic AI Architecture
                  </h3>
                  <div className="architecture-grid">
                    <div className="arch-item">
                      <div className="arch-badge">Planner</div>
                      <p>Created 5-step execution plan using ReAct pattern</p>
                    </div>
                    <div className="arch-item">
                      <div className="arch-badge">Executor</div>
                      <p>Used URL parser, YouTube API, Gemini 2.5 Flash, and keyword extractor</p>
                    </div>
                    <div className="arch-item">
                      <div className="arch-badge">Memory</div>
                      <p>Logged all agent activities with timestamps</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="footer">
          <p>Built for the Agentic AI Hackathon • Powered by Google Gemini & ReAct Pattern</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
