import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../static/CSS/MoviesGrid.css";

const MoviesGrid = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  
  const moviesPerPage = 5;

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error loading movies:", err));
  }, []);

  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = movies.slice(startIndex, startIndex + moviesPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleMovieClick = (imdbId) => {
    navigate(`/movies/${imdbId}`);
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" });
  };

  return (
    <div className="movies-grid-wrapper">
      <h2 className="grid-title">All Movies</h2>

      <div className="movies-grid">
        {currentMovies.map((movie) => (
          <div key={movie.imdbId} className="movie-item" 
          onClick={() => handleMovieClick(movie.imdbId)
          }>
            <Link to={`/movies/${movie.imdbId}`} className="movie-link">
              <img src={movie.poster} alt={movie.title} />
              <p className="movie-name">{movie.title}</p>
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => changePage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviesGrid;
