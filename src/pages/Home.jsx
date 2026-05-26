import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import { movieApi } from '../services/movieApi';

const Home = () => {
  const [originals, setOriginals] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const twilightSagaMovies = originals
    .filter((movie) => movie.title.toLowerCase().includes('twilight'))
    .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

  const avengersMovies = originals
    .filter((movie) => movie.title.toLowerCase().includes('avengers'))
    .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [orig, hero, trendingData, topRatedData, actionData] = await Promise.all([
          movieApi.fetchOriginals(),
          movieApi.fetchHeroMovies(),
          movieApi.fetchTrending(),
          movieApi.fetchTopRated(),
          movieApi.fetchActionMovies()
        ]);

        setOriginals(orig.results);
        setHeroMovies(hero.results);
        setTrending(trendingData.results);
        setTopRated(topRatedData.results);
        setActionMovies(actionData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <style>{`
          .loading-screen {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-main);
          }
          .loader {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.1);
            border-radius: 50%;
            border-top-color: var(--accent-primary);
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="home-page animate-fade-in">
      <HeroBanner movies={heroMovies} />
      
      <div className="content-rows">
        <MovieRow title="New to LuminaStream+" movies={originals} />
        <MovieRow title="Twilight Saga" movies={twilightSagaMovies} />
        <MovieRow title="Avengers" movies={avengersMovies} />
        <MovieRow title="Trending Now" movies={trending} />
        <MovieRow title="Top Rated Classics" movies={topRated} />
        <MovieRow title="Blockbuster Action" movies={actionMovies} />
      </div>
      
      <style>{`
        .home-page {
          background: var(--bg-main);
          min-height: 100vh;
          padding-bottom: 50px;
        }

        .content-rows {
          margin-top: -100px;
          position: relative;
          z-index: 5;
        }
      `}</style>
    </div>
  );
};

export default Home;
