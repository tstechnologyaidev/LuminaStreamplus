import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, ArrowLeft, Users, Camera, X, Calendar, MapPin, Star } from 'lucide-react';
import { movieApi, getImageUrl } from '../services/movieApi';
import { useWatchlist } from '../context/WatchlistContext';

const PersonModal = ({ person, onClose }) => {
  if (!person) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="person-modal animate-scale-up" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}><X size={24} /></button>

        <div className="modal-content">
          <div className="modal-left">
            <div className="modal-photo">
              <img src={getImageUrl(person.profile_path, 'h632')} alt={person.name} />
            </div>
          </div>

          <div className="modal-right">
            <h2 className="modal-name">{person.name}</h2>
            <p className="modal-role">{person.character || person.job}</p>

            <div className="modal-stats">
              {person.birthday && (
                <div className="stat-item">
                  <Calendar size={16} /> <span>Born: {person.birthday}</span>
                </div>
              )}
              <div className="stat-item">
                <Star size={16} /> <span>Famous for: {person.known_for || 'Blockbuster Cinema'}</span>
              </div>
            </div>

            <div className="modal-bio-section">
              <h3 className="bio-title">Biography</h3>
              <p className="modal-bio">
                {person.bio || `${person.name} is a renowned professional in the film industry, contributing their exceptional talents to various critically acclaimed and commercially successful projects. Known for their dedication and unique artistic vision, they continue to be a significant influence in modern cinema.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .person-modal {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          width: 900px;
          max-width: 100%;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .close-modal {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 2010;
        }

        .close-modal:hover {
          background: var(--accent-primary);
          transform: rotate(90deg);
        }

        .modal-content {
          display: flex;
          gap: 40px;
          padding: 40px;
        }

        .modal-left {
          flex: 0 0 300px;
        }

        .modal-photo {
          width: 100%;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .modal-photo img {
          width: 100%;
          height: auto;
          display: block;
        }

        .modal-right {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .modal-name {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 5px;
          color: white;
        }

        .modal-role {
          font-size: 1.2rem;
          color: var(--accent-primary);
          font-weight: 600;
          margin-bottom: 25px;
        }

        .modal-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #cbd5e1;
          font-size: 0.95rem;
        }

        .modal-bio-section {
          flex: 1;
        }

        .bio-title {
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #94a3b8;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .modal-bio {
          line-height: 1.7;
          color: #e2e8f0;
          font-size: 1.05rem;
        }

        @media (max-width: 850px) {
          .modal-content {
            flex-direction: column;
            padding: 30px;
            align-items: center;
            text-align: center;
          }
          .modal-left {
            flex: 0 0 auto;
            width: 200px;
          }
          .modal-stats {
            justify-content: center;
          }
          .modal-name {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, creditData] = await Promise.all([
          movieApi.fetchMovieDetails(id),
          movieApi.fetchMovieCredits(id)
        ]);
        setMovie(movieData);
        setCredits(creditData);
      } catch (error) {
        console.error("Error fetching movie data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (!movie) return <div className="error-msg">Movie not found</div>;

  const bgStyle = {
    backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'w1280')})`,
    backgroundPosition: 'top center',
    backgroundSize: 'cover',
  };

  const isAdded = isInWatchlist(movie.id);
  const hasCredits = credits.cast.length > 0 || credits.crew.length > 0;

  return (
    <div className="movie-details-page animate-fade-in" style={bgStyle}>
      <div className="details-overlay"></div>

      <button className="back-btn-details" onClick={() => navigate(-1)}>
        <ArrowLeft size={30} />
      </button>

      <div className="details-content">
        <div className="poster-col">
          <img src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title} />
        </div>

        <div className="info-col">
          <h1 className="title">{movie.title || movie.name}</h1>
          <div className="meta">
            {movie.vote_average > 0 && <span className="rating">{Math.round(movie.vote_average * 10)}% Match</span>}
            <span className="year">{movie.release_date?.substring(0, 4)}</span>
            {movie.runtime && <span className="runtime">{movie.runtime} min</span>}
            {movie.isComingSoon && <span className="coming-soon-badge">COMING SOON</span>}
          </div>

          {movie.tagline && <h3 className="tagline">"{movie.tagline}"</h3>}
          <p className="overview">{movie.overview}</p>

          <div className="actions">
            {!movie.isComingSoon && (
              <button className="btn btn-primary" onClick={() => navigate(`/play/${movie.id}`)}>
                <Play fill="currentColor" size={24} /> Play Now
              </button>
            )}
            <button
              className={`btn ${isAdded ? 'btn-secondary added' : 'btn-secondary'}`}
              onClick={() => toggleWatchlist(movie)}
            >
              {isAdded ? <><Check size={24} /> Added to List</> : <><Plus size={24} /> Add to List</>}
            </button>
          </div>

          {hasCredits && (
            <div className="credits-section">
              {credits.cast.length > 0 && (
                <div className="credit-block">
                  <h3 className="section-title"><Users size={20} /> Top Cast</h3>
                  <div className="actor-scroll-container">
                    <div className="actor-row-inner">
                      {credits.cast.map(person => (
                        <div
                          key={person.id}
                          className="person-card interactive"
                          onClick={() => setSelectedPerson(person)}
                        >
                          <div className="person-photo">
                            <img
                              src={getImageUrl(person.profile_path, 'w185')}
                              alt={person.name}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop';
                              }}
                            />
                          </div>
                          <div className="person-info">
                            <p className="person-name">{person.name}</p>
                            <p className="person-role">{person.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {credits.crew.length > 0 && (
                <div className="credit-block">
                  <h3 className="section-title"><Camera size={20} /> Key Crew</h3>
                  <div className="actor-scroll-container">
                    <div className="actor-row-inner">
                      {credits.crew.map(person => (
                        <div
                          key={person.id}
                          className="person-card interactive"
                          onClick={() => setSelectedPerson(person)}
                        >
                          <div className="person-photo">
                            <img
                              src={getImageUrl(person.profile_path, 'w185')}
                              alt={person.name}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop';
                              }}
                            />
                          </div>
                          <div className="person-info">
                            <p className="person-name">{person.name}</p>
                            <p className="person-role">{person.job}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedPerson && (
        <PersonModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}

      <style>{`
        .movie-details-page {
          min-height: 100vh;
          position: relative;
          color: white;
          padding-top: var(--nav-height);
          overflow-x: hidden;
        }

        .details-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            var(--bg-main) 10%,
            rgba(10, 10, 15, 0.8) 50%,
            rgba(10, 10, 15, 0.3) 100%
          ),
          linear-gradient(
            to top,
            var(--bg-main) 0%,
            transparent 50%
          );
        }

        .back-btn-details {
          position: absolute;
          top: calc(var(--nav-height) + 20px);
          left: 4%;
          z-index: 20;
          background: rgba(0,0,0,0.5);
          color: white;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }

        .back-btn-details:hover {
          background: var(--gradient-accent);
          transform: scale(1.1);
        }

        .details-content {
          position: relative;
          z-index: 10;
          display: flex;
          gap: 50px;
          padding: 80px 4% 100px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .poster-col img {
          width: 350px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
          border: 1px solid var(--border-light);
        }

        .info-col {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .title {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 20px;
          line-height: 1.1;
          background: linear-gradient(to bottom, #fff, #ccc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .meta {
          display: flex;
          gap: 20px;
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 20px;
          align-items: center;
        }

        .rating { color: #10b981; }

        .coming-soon-badge {
          background: var(--accent-primary);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .tagline {
          font-size: 1.4rem;
          color: var(--text-muted);
          font-style: italic;
          margin-bottom: 20px;
          font-weight: 400;
        }

        .overview {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #e5e7eb;
          margin-bottom: 40px;
          max-width: 800px;
        }

        .actions {
          display: flex;
          gap: 20px;
          margin-bottom: 50px;
        }

        .actions .btn {
          font-size: 1.1rem;
          padding: 12px 28px;
        }

        .added {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .credits-section {
          margin-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 50px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.6rem;
          margin-bottom: 25px;
          font-weight: 700;
          color: white;
        }

        .actor-scroll-container {
          width: 100%;
          overflow-x: auto;
          padding-bottom: 20px;
          margin: 0 -10px;
          scrollbar-width: thin;
          scrollbar-color: var(--accent-primary) transparent;
        }

        .actor-scroll-container::-webkit-scrollbar {
          height: 6px;
        }

        .actor-scroll-container::-webkit-scrollbar-thumb {
          background: var(--accent-primary);
          border-radius: 10px;
        }

        .actor-row-inner {
          display: flex;
          gap: 20px;
          padding: 10px;
        }

        .person-card {
          flex: 0 0 160px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .person-card.interactive {
          cursor: pointer;
        }

        .person-card:hover {
          transform: translateY(-8px);
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .person-photo {
          aspect-ratio: 1/1;
          overflow: hidden;
        }

        .person-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .person-card:hover .person-photo img {
          transform: scale(1.1);
        }

        .person-info {
          padding: 12px;
          text-align: center;
        }

        .person-name {
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 4px;
          color: white;
        }

        .person-role {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.2;
        }

        .loader-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .error-msg {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        @media (max-width: 1024px) {
          .details-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .info-col {
            align-items: center;
          }
          .actions {
            justify-content: center;
          }
          .section-title {
            justify-content: center;
          }
          .actor-grid {
            justify-content: center;
          }
          .overview {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MovieDetails;
