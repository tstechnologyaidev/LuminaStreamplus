import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/" className="brand-logo">
          <span>Lumina</span>Stream+
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          <li><Link to="/series">Series</Link></li>
          <li><Link to="/mylist">My List {watchlist.length > 0 && <span className="nav-badge">{watchlist.length}</span>}</Link></li>
        </ul>
      </div>

      <div className="navbar-right">
        <form className="search-box" onSubmit={handleSearch}>
          <Search size={20} className="icon" onClick={handleSearch} />
          <input 
            type="text" 
            placeholder="Search titles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <div className="relative-container">
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={22} />
            <span className="badge"></span>
          </button>
          {showNotifications && (
            <div className="dropdown animate-fade-in">
              <h4>Notifications</h4>
              <p>New Arrival: Interstellar Odyssey now available in 4K!</p>
              <p>Feature: Try the new dark mode aesthetics.</p>
            </div>
          )}
        </div>

        <div className="relative-container">
          <div className="user-profile" onClick={() => setShowProfile(!showProfile)}>
            <User size={22} />
          </div>
          {showProfile && (
            <div className="dropdown profile-dropdown animate-fade-in">
              <Link to="/profile">Manage Profiles</Link>
              <Link to="/account">Account Settings</Link>
              <Link to="/help">Help Center</Link>
              <hr />
              <Link to="/logout">Sign out of Lumina</Link>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; width: 100%; height: var(--nav-height);
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 4%; z-index: 100; transition: all 0.4s ease;
        }

        .navbar.scrolled {
          background: var(--bg-glass-heavy);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-light);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .navbar-left { display: flex; align-items: center; gap: 40px; }
        .brand-logo { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 900; color: white; letter-spacing: -0.5px; }
        .brand-logo span { background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        .nav-links { display: flex; list-style: none; gap: 24px; align-items: center; }
        .nav-links a { display: flex; align-items: center; gap: 5px; color: var(--text-muted); font-weight: 500; font-size: 0.95rem; transition: color 0.3s ease; }
        .nav-links a:hover { color: white; }
        
        .nav-badge { background: var(--accent-secondary); color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; font-weight: bold; }

        .navbar-right { display: flex; align-items: center; gap: 20px; }

        .search-box {
          display: flex; align-items: center;
          background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-light);
          border-radius: 30px; transition: all 0.3s ease;
          width: 40px; justify-content: center; cursor: pointer;
          height: 40px;
        }

        .search-box:focus-within, .search-box:hover {
          width: 250px; padding: 0 16px; justify-content: flex-start;
          background: rgba(255, 255, 255, 0.1); cursor: text;
        }

        .search-box input { background: transparent; border: none; outline: none; color: white; width: 100%; margin-left: 10px; display: none; }
        .search-box:focus-within input, .search-box:hover input { display: block; }
        .search-box .icon { color: var(--text-muted); }

        .relative-container { position: relative; }
        .icon-btn { background: transparent; color: white; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; position: relative; }
        .icon-btn:hover { transform: scale(1.1); }
        .badge { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: var(--accent-secondary); border-radius: 50%; box-shadow: 0 0 10px var(--accent-secondary); }

        .user-profile { width: 40px; height: 40px; border-radius: 50%; background: var(--gradient-accent); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: box-shadow 0.3s; }
        .user-profile:hover { box-shadow: var(--shadow-glow); }

        .dropdown { position: absolute; top: 180%; right: 0; background: var(--bg-secondary); border: 1px solid var(--border-light); padding: 15px; border-radius: var(--border-radius-md); width: 280px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
        .dropdown h4 { margin-bottom: 10px; border-bottom: 1px solid var(--border-light); padding-bottom: 5px; }
        .dropdown p { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px; }
        .dropdown p:last-child { margin-bottom: 0; }

        .profile-dropdown { width: 200px; display: flex; flex-direction: column; gap: 10px; }
        .profile-dropdown a { color: var(--text-muted); font-size: 0.9rem; transition: color 0.2s; }
        .profile-dropdown a:hover { color: white; }
        .profile-dropdown hr { border: none; border-top: 1px solid var(--border-light); margin: 5px 0; }
      `}</style>
    </nav>
  );
};

export default Navbar;
