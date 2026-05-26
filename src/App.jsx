import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import MyList from './pages/MyList';
import MovieDetails from './pages/MovieDetails';
import Player from './pages/Player';
import { WatchlistProvider } from './context/WatchlistContext';

function App() {
  return (
    <WatchlistProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/play/:id" element={<Player />} />
            <Route 
              path="*" 
              element={
                <>
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/mylist" element={<MyList />} />
                      <Route path="/movie/:id" element={<MovieDetails />} />
                      {/* Placeholder routes for links in Navbar */}
                      <Route path="/movies" element={<Home />} />
                      <Route path="/series" element={<Home />} />
                    </Routes>
                  </main>
                </>
              } 
            />
          </Routes>
        </div>
      </Router>
    </WatchlistProvider>
  );
}

export default App;
