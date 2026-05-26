import { useState, useEffect, useCallback } from 'react';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/movieApi';

const HeroBanner = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, [nextSlide, movies.length]);

  if (!movies || movies.length === 0) return <div className="hero placeholder-bg"></div>;

  const currentMovie = movies[currentIndex];

  const bgStyle = {
    backgroundImage: `url(${getImageUrl(currentMovie.backdrop_path, 'w1280')})`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
  };

  return (
    <header className="hero" style={bgStyle}>
      <div className="hero-overlay"></div>

      <div className="hero-content-wrapper">
        <div key={currentMovie.id} className="hero-content animate-fade-in-up">
          <h1 className="hero-title">{currentMovie.title}</h1>
          <div className="hero-meta">
            <span className="release-year">{currentMovie.release_date?.substring(0, 4) || '2026'}</span>
            <span className="certification">HD</span>
            {currentMovie.isComingSoon && <span className="coming-soon-badge">COMING SOON</span>}
          </div>

          <p className="hero-description">{currentMovie.overview}</p>

          <div className="hero-actions">
            {!currentMovie.isComingSoon && (
              <button className="btn btn-primary" onClick={() => navigate(`/play/${currentMovie.id}`)}>
                <Play size={20} fill="currentColor" /> Play Now
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => navigate(`/movie/${currentMovie.id}`)}>
              <Info size={20} /> More Info
            </button>
          </div>
        </div>
      </div>

      {movies.length > 1 && (
        <>
          <button className="hero-arrow left" onClick={prevSlide}>
            <ChevronLeft size={40} />
          </button>
          <button className="hero-arrow right" onClick={nextSlide}>
            <ChevronRight size={40} />
          </button>

          <div className="hero-indicators">
            {movies.map((_, idx) => (
              <button
                key={idx}
                className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </>
      )}

      <style>{`
        .hero {
          height: 85vh;
          min-height: 700px;
          position: relative;
          color: white;
          overflow: hidden;
          transition: background-image 0.8s ease-in-out;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(10, 10, 15, 0.2) 0%,
            rgba(10, 10, 15, 0.4) 40%,
            var(--bg-main) 100%
          ),
          linear-gradient(
            to right,
            rgba(10, 10, 15, 0.8) 0%,
            rgba(10, 10, 15, 0) 60%
          );
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 4%;
        }

        .hero-content {
          width: 50%;
          max-width: 650px;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 950;
          line-height: 1.05;
          margin-bottom: 25px;
          text-shadow: 0 4px 12px rgba(0,0,0,0.5);
          letter-spacing: -1px;
        }

        .hero-meta {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .coming-soon-badge {
          background: var(--accent-primary);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .certification {
          border: 1px solid rgba(255,255,255,0.3);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.85rem;
          background: rgba(255,255,255,0.1);
        }

        .hero-description {
          font-size: 1.25rem;
          line-height: 1.5;
          color: #e5e7eb;
          text-shadow: 0 2px 4px rgba(0,0,0,0.8);
          margin-bottom: 40px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hero-actions {
          display: flex;
          gap: 20px;
        }

        .hero-actions .btn {
          font-size: 1.2rem;
          padding: 14px 32px;
          font-weight: 700;
        }

        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          background: transparent;
          color: white;
          opacity: 0.4;
          transition: all 0.3s ease;
          padding: 20px;
        }

        .hero-arrow:hover {
          opacity: 1;
          scale: 1.1;
        }

        .hero-arrow.left { left: 10px; }
        .hero-arrow.right { right: 10px; }

        .hero-indicators {
          position: absolute;
          bottom: 100px;
          right: 4%;
          z-index: 20;
          display: flex;
          gap: 12px;
        }

        .indicator {
          width: 30px;
          height: 3px;
          background: rgba(255,255,255,0.3);
          transition: all 0.4s ease;
          border-radius: 2px;
        }

        .indicator.active {
          background: white;
          width: 50px;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .hero-content { width: 80%; }
          .hero-title { font-size: 3.5rem; }
        }
      `}</style>
    </header>
  );
};

export default HeroBanner;
