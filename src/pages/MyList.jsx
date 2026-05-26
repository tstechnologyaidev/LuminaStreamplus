import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';

const MyList = () => {
  const { watchlist } = useWatchlist();

  return (
    <div className="mylist-page animate-fade-in">
      <h1 className="page-title">My List</h1>
      
      {watchlist.length === 0 ? (
        <div className="empty-state">
          <h2>Your list is empty</h2>
          <p>Add shows and movies to your list so you can easily find them later.</p>
        </div>
      ) : (
        <div className="movie-grid">
          {watchlist.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <style>{`
        .mylist-page {
          padding: calc(var(--nav-height) + 40px) 4% 40px;
          min-height: 100vh;
        }

        .page-title {
          font-size: 2.5rem;
          margin-bottom: 30px;
          color: white;
        }

        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .empty-state {
          text-align: center;
          padding: 100px 0;
          color: var(--text-muted);
        }

        .empty-state h2 {
          font-size: 2rem;
          margin-bottom: 15px;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default MyList;
