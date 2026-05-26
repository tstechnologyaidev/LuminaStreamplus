import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, AlertTriangle, RefreshCw, Play } from 'lucide-react';
import { movieApi } from '../services/movieApi';
import { getFullMovieUrl } from '../services/videoDb';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoKey, setVideoKey] = useState(null);
  const [fullMovieUrl, setFullMovieUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedTime, setSavedTime] = useState(0);

  useEffect(() => {
    const fetchVideoSources = async () => {
      setLoading(true);
      setError(null);
      try {
        const customDbUrl = await getFullMovieUrl(id);

        if (customDbUrl) {
          setFullMovieUrl(customDbUrl);
        } else {
          const data = await movieApi.fetchMovieVideos(id);
          if (data.results && data.results.length > 0) {
            const trailer = data.results.find(vid => vid.type === 'Trailer') || data.results[0];
            setVideoKey(trailer.key);
          }
        }
      } catch (err) {
        console.error("Failed to load video sources", err);
        setError("Could not connect to the video server. This may be a network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideoSources();
  }, [id]);

  const handleTimeUpdate = () => {
    if (videoRef.current && !showResumePrompt) {
      const currentTime = videoRef.current.currentTime;
      if (Math.floor(currentTime) % 5 === 0) {
        localStorage.setItem(`lumina_progress_${id}`, currentTime.toString());
      }
    }
  };

  const handleLoadedMetadata = () => {
    const saved = localStorage.getItem(`lumina_progress_${id}`);
    if (saved && parseFloat(saved) > 10) {
      setSavedTime(parseFloat(saved));
      setShowResumePrompt(true);
      if (videoRef.current) videoRef.current.pause();
    }
  };

  const handleResume = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = savedTime;
      videoRef.current.play().catch(e => console.error("Auto-play blocked", e));
    }
    setShowResumePrompt(false);
  };

  const handleStartOver = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
    setShowResumePrompt(false);
    localStorage.removeItem(`lumina_progress_${id}`);
  };

  const handleVideoError = () => {
    setError("The movie stopped unexpectedly. This usually happens due to a temporary network hiccup or a large file buffering issue.");
  };

  return (
    <div className="player-container animate-fade-in">
      <div className="player-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={30} />
        </button>
      </div>

      {loading ? (
        <div className="loader-box">
          <div className="loader"></div>
          <p>Preparing your cinema experience...</p>
        </div>
      ) : error ? (
        <div className="error-screen">
          <AlertTriangle size={60} color="var(--accent-primary)" />
          <h2>Playback Issue Detected</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            <RefreshCw size={20} /> Reload & Retry
          </button>
        </div>
      ) : fullMovieUrl ? (
        <div className="video-wrapper">
          <video
            ref={videoRef}
            controls
            autoPlay
            className="streaming-video"
            src={fullMovieUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleVideoError}
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
          >
            Your browser does not support HTML5 streaming video.
          </video>

          {showResumePrompt && (
            <div className="resume-overlay">
              <div className="resume-card animate-scale-up">
                <h3>Welcome Back</h3>
                <p>We saved your progress. Would you like to resume from <strong>{Math.floor(savedTime / 60)}:{(Math.floor(savedTime % 60)).toString().padStart(2, '0')}</strong>?</p>
                <div className="resume-actions">
                  <button className="btn-resume" onClick={handleResume}>
                    <Play size={20} fill="currentColor" /> Resume Movie
                  </button>
                  <button className="btn-restart" onClick={handleStartOver}>
                    <RotateCcw size={20} /> Start Over
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : videoKey ? (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&showinfo=0&modestbranding=1`}
          title="Movie Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="error-screen">
          <AlertTriangle size={60} />
          <h2>No Video Available</h2>
          <p>Please check back later.</p>
        </div>
      )}

      <style>{`
        .player-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .player-header {
          position: absolute;
          top: 30px;
          left: 30px;
          z-index: 1010;
        }

        .back-btn {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          color: white;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: var(--accent-primary);
          transform: scale(1.1);
        }

        .video-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .streaming-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .resume-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1020;
        }

        .resume-card {
          background: linear-gradient(135deg, #1e1e2f 0%, #11111d 100%);
          padding: 40px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.1);
          text-align: center;
          max-width: 450px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }

        .resume-card h3 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: white;
        }

        .resume-card p {
          color: #94a3b8;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .resume-actions {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .btn-resume {
          background: var(--accent-primary);
          color: white;
          padding: 16px;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .btn-restart {
          background: rgba(255,255,255,0.05);
          color: #cbd5e1;
          padding: 16px;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
        }

        .btn-resume:hover { transform: scale(1.02); }
        .btn-restart:hover { background: rgba(255,255,255,0.1); }

        .loader-box {
          text-align: center;
          color: white;
        }

        .loader {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          border-top-color: var(--accent-primary);
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        .error-screen {
          color: white;
          text-align: center;
          max-width: 500px;
          padding: 40px;
        }

        .error-screen h2 { margin: 20px 0 10px; }
        .error-screen p { color: #94a3b8; margin-bottom: 30px; }

        .retry-btn {
          background: var(--accent-primary);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          cursor: pointer;
          margin: 0 auto;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        
        .animate-scale-up {
          animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Player;
