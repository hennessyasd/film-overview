import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoSlash, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import api from "../api/axios-config";
import { AuthContext } from "../context/AuthProvider";
import "../static/CSS/Header.css";

const Header = () => {
  const { auth, logout } = useContext(AuthContext);

  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [foundMovies, setFoundMovies] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    setError("");
    setFoundMovies([]);
    setQuery("");
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setFoundMovies([]);
      setError("");
      return;
    }
    
    try {
      const response = await api.get(`/api/v1/movies/search?title=${searchQuery.trim()}`);
      const movies = response.data;
      if (!movies || movies.length === 0) {
        setError("Film not found");
        setFoundMovies([]);
      } else {
        setError("");
        setFoundMovies(movies);
      }
    } catch (e) {
      console.error(e);
      setError("Film not found");
      setFoundMovies([]);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query.trim()) handleSearch(query);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setError("");
        setFoundMovies([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMovieClick = (imdbId) => {
    setFoundMovies([]);
    setShowSearch(false);
    navigate(`/movies/${imdbId}`);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faVideoSlash} className="logo-icon" />
          <span className="logo-text">FilmOverview</span>
        </div>

        <nav className="nav-buttons">
          <button className="nav-btn search-btn" onClick={toggleSearch}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <span>Search</span>
          </button>

          {auth.token ? (
             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                    textTransform: 'capitalize',
                    fontSize: '1.4rem'
                }}>
                    {auth.username}
                </span>
                <button 
                    onClick={logout} 
                    className="nav-btn" 
                    style={{ cursor: 'pointer', border: '1px solid white' }}
                >
                    Logout
                </button>
             </div>
          ) : (
             <>
                <NavLink to="/login" className="nav-btn">Sign in</NavLink>
             </>
          )}

        </nav>
      </div>

      {showSearch && (
        <div ref={searchRef} className="search-container">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {error && <span className="search-error">{error}</span>}

          {foundMovies.length > 0 && (
            <div className="search-results">
              {foundMovies.map((movie) => (
                <div
                  key={movie.imdbId}
                  className="search-result-item"
                  onClick={() => handleMovieClick(movie.imdbId)}
                >
                  <img src={movie.poster} alt={movie.title} />
                  <div className="search-result-info">
                    <h4>{movie.title}</h4>
                    <p>{movie.releaseDate}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
