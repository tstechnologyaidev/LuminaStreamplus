import { createContext, useState, useEffect, useContext } from 'react';

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    // Load from local storage if available
    const saved = localStorage.getItem('lumina-watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lumina-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (movie) => {
    setWatchlist((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const isInWatchlist = (id) => {
    return watchlist.some((m) => m.id === id);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
