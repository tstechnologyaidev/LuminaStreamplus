import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { movieApi } from '../services/movieApi';

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await movieApi.searchMovies(query);
        setResults(data.results || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [query]);

  return (
    <div className="search-page animate-fade-in">
      <h1 className="search-title">Search Results for "{query}"</h1>

      {loading ? (
        <div className="loader"></div>
      ) : results.length === 0 ? (
        <p className="no-results">No movies found matching your query.</p>
      ) : (
        <div className="movie-grid">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <style>{`
        .search-page {
          padding: calc(var(--nav-height) + 40px) 4% 40px;
          min-height: 100vh;
        }

        .search-title {
          font-size: 2.5rem;
          margin-bottom: 30px;
        }

        .no-results {
          font-size: 1.5rem;
          color: var(--text-muted);
          text-align: center;
          margin-top: 50px;
        }

        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .loader {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          border-top-color: var(--accent-primary);
          animation: spin 1s ease-in-out infinite;
          margin: 100px auto;
        }
      `}</style>
    </div>
  );
};

export default Search;
