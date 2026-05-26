import { Play, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/movieApi';
import { useWatchlist } from '../context/WatchlistContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  const isAdded = isInWatchlist(movie.id);

  const handleCardClick = () => {
    console.log("Loading Poster for:", movie.title, "Path:", movie.poster_path);
    navigate(`/movie/${movie.id}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    navigate(`/play/${movie.id}`);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="image-wrapper">
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title || movie.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1485099047704-5853f6567295?q=80&w=600&auto=format&fit=crop';
          }}
        />
        <div className="card-overlay">
          <div className="card-actions">
            <button className="play-btn" onClick={handlePlayClick}>
              <Play fill="currentColor" size={16} />
            </button>
            <button className={`add-btn ${isAdded ? 'added' : ''}`} onClick={handleAddClick}>
              {isAdded ? <Check size={16} /> : <Plus size={16} />}
            </button>
          </div>
          <div className="card-info">
            <h4 className="title">{movie.title || movie.name}</h4>
            <p className="description">{movie.overview}</p>
          </div>
        </div>
      </div>

      <style>{`
        .movie-card {
          flex: 0 0 calc(100% / 6 - 15px);
          min-width: 180px;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }

        .movie-card:hover {
          transform: scale(1.1) translateY(-8px);
          z-index: 20;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.9), 0 0 15px rgba(139, 92, 246, 0.3);
          border-color: var(--accent-primary);
        }

        .image-wrapper {
          position: relative;
          aspect-ratio: 2/3;
        }

        .image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.3s;
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.5) 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 15px;
        }

        .movie-card:hover .card-overlay {
          opacity: 1;
        }

        .card-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
          transform: translateY(20px);
          transition: transform 0.4s ease;
        }

        .movie-card:hover .card-actions {
          transform: translateY(0);
        }

        .play-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .play-btn:hover {
          background: var(--gradient-accent);
          color: white;
          border: none;
        }

        .add-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-light);
          color: white;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s, border-color 0.3s;
        }

        .add-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .add-btn.added {
          border-color: #10b981;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .title {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .description {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MovieCard;
