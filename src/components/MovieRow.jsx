import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-row-container">
      <h2 className="row-title">{title}</h2>
      
      <div className="row-wrapper">
        <button 
          className="slider-arrow left" 
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft size={30} />
        </button>

        <div className="movie-row" ref={rowRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <button 
          className="slider-arrow right" 
          onClick={() => handleScroll('right')}
        >
          <ChevronRight size={30} />
        </button>
      </div>

      <style>{`
        .movie-row-container {
          margin: 40px 0;
          padding: 0 4%;
          position: relative;
        }

        .row-title {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: white;
          font-weight: 700;
        }

        .row-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .movie-row {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 20px 0;
          scroll-behavior: smooth;
        }

        .movie-row::-webkit-scrollbar {
          display: none;
        }

        .slider-arrow {
          position: absolute;
          z-index: 10;
          background: rgba(10, 10, 15, 0.7);
          color: white;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: all 0.3s ease;
          border: 1px solid var(--border-light);
          cursor: pointer;
        }

        .slider-arrow:hover {
          background: var(--gradient-accent);
          transform: scale(1.1);
          border: none;
        }

        .row-wrapper:hover .slider-arrow {
          opacity: 1;
        }

        .slider-arrow.left { left: -25px; }
        .slider-arrow.right { right: -25px; }
      `}</style>
    </div>
  );
};

export default MovieRow;
