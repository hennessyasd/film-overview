import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { Paper } from "@mui/material";
import ReviewModal from "./reviewModal";

import "../static/CSS/Hero.css"
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Hero = ({ movies }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [openReview, setOpenReview] = useState(false);
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return <div className="movie-carousel-empty">Загрузка фильмов...</div>;

  const handleMovieClick = (imdbId) => {
    navigate(`/movies/${imdbId}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth" });
  };

  const handleOpenReview = (movie) => {
    setSelectedMovie(movie);
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
    setSelectedMovie(null);
  };

  return (
    <div className="movie-carousel-container">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={4000}
        showStatus={false}
        transitionTime={1000}
        emulateTouch
      >
        {movies.map((movie) => (
          <Paper key={movie.imdbId || movie.id} elevation={6}>
            <div className="movie-card">
              <div className="movie-poster" onClick={() => handleMovieClick(movie.imdbId)}>
                <img src={movie.poster} alt={movie.title} />
              </div>

              <div className="movie-title">
                <h3>{movie.title}</h3>
              </div>

              <div className="movie-buttons-container">
                <NavLink to={`/Trailer/${movie.trailerLink.substring(movie.trailerLink.length - 11)}`}>
                  <div className="play-buttons-icon-container">
                    <FontAwesomeIcon className="play-button-icon" icon={faCirclePlay} />
                  </div>
                </NavLink>

                <button className="review-btn" onClick={() => handleOpenReview(movie)}>
                  Review
                </button>
              </div>
            </div>
          </Paper>
        ))}
      </Carousel>

      <ReviewModal open={openReview} onClose={handleCloseReview} movie={selectedMovie} />
    </div>
  );
};

export default Hero;
