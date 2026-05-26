import { newToLuminaStreamPlus } from './customLibrary';

// Helper to provide image URLs
export const getImageUrl = (path, size = 'original') => {
  // Ultra-premium high-res fallback for missing images from Unsplash
  const fallback = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop';
  
  if (!path) return fallback;
  
  if (path.startsWith('http')) return path;

  // TMDB base URL for relative paths
  if (path.startsWith('/') && !path.startsWith('/images') && !path.startsWith('/videos')) {
      return `https://image.tmdb.org/t/p/${size}${path}`;
  }
  
  return path;
};

// Simplified Services (No external API calls)
export const movieApi = {
  fetchOriginals: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ results: newToLuminaStreamPlus }), 300);
    });
  },

  /**
   * Hero Section Logic:
   * 1. If total real (non-mock) movies >= 11, remove Top Gun (603692) and show only the latest 10.
   * 2. Else, include all real movies (including Top Gun) and fill the rest up to 10 with "Coming Soon" mocks.
   */
  fetchHeroMovies: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const realMovies = newToLuminaStreamPlus.filter(m => !m.isComingSoon);
        const mockMovies = newToLuminaStreamPlus.filter(m => m.isComingSoon);
        
        let heroItems = [];
        
        if (realMovies.length >= 11) {
          // If we have 11+, remove Top Gun and take the latest 10
          heroItems = realMovies.filter(m => m.id !== '603692').slice(0, 10);
        } else {
          // Show all real movies (including Top Gun if it's there)
          // Then fill with mocks up to 10 slots
          heroItems = [...realMovies, ...mockMovies.slice(0, 10 - realMovies.length)];
        }
        
        resolve({ results: heroItems });
      }, 300);
    });
  },

  fetchTrending: async () => {
    return { results: [] };
  },
  
  fetchTopRated: async () => {
    return { results: [] };
  },
  
  fetchActionMovies: async () => {
    return { results: [] };
  },

  searchMovies: async (query) => {
    const matchingOriginals = newToLuminaStreamPlus.filter(m => 
      m.title.toLowerCase().includes(query.toLowerCase())
    );
    return { results: matchingOriginals };
  },

  fetchMovieDetails: async (id) => {
    const customMatch = newToLuminaStreamPlus.find(m => m.id.toString() === id.toString());
    return customMatch || null;
  },

  fetchMovieVideos: async (id) => {
    return { results: [] };
  },

  fetchMovieCredits: async (id) => {
    const movie = newToLuminaStreamPlus.find(m => m.id.toString() === id.toString());
    if (movie) {
      return { cast: movie.cast || [], crew: movie.crew || [] };
    }
    return { cast: [], crew: [] };
  }
};
