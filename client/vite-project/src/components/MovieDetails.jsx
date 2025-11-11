import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios-config";
import "../static/CSS/MovieDetails.css";

const MovieDetails = () => {
  const { imdbId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("...");
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!imdbId) return;
    setLoading(true);

    // 1) load movie
    api.get(`/api/v1/movies/${imdbId}`)
      .then(res => {
        const data = res.data;
        if (data && data.imdbId) {
          setMovie(data);
        } else if (
          data &&
          Object.prototype.hasOwnProperty.call(data, "present") &&
          data.present === true &&
          Object.prototype.hasOwnProperty.call(data, "value")
        ) {
          setMovie(data.value);
        } else if (
          data &&
          Object.prototype.hasOwnProperty.call(data, "value")
        ) {
          setMovie(data.value);
        }
      })
      .catch(err => {
        console.error("movie load error:", err);
      })
      .finally(() => setLoading(false));

    api.get(`/api/v1/reviews/movie/${imdbId}`)
      .then(res => setReviews(res.data || []))
      .catch(err => { console.error("reviews load error", err); setReviews([]); });

    api.get(`/api/v1/movies/${imdbId}/rating`)
      .then(res => {
        if (res.data && res.data.rating) setRating(res.data.rating);
        else if (typeof res.data === "string" || typeof res.data === "number") setRating(res.data);
        else setRating("N/A");
      })
      .catch(err => {
        console.error("rating load error", err);
        setRating("N/A");
      });

  }, [imdbId]);

  const submitReview = async () => {
    if (!newReview.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/api/v1/reviews", { reviewBody: newReview.trim(), imdbId });
      const resp = await api.get(`/api/v1/reviews/movie/${imdbId}`);
      setReviews(resp.data || []);
      setNewReview("");
    } catch (err) {
      console.error("submit review error", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="md-loading">Загрузка фильма...</div>;
  if (!movie) return <div className="md-no-movie">Фильм не найден</div>;

  const trailerEmbed = (() => {
    if (!movie.trailerLink) return null;
    if (movie.trailerLink.includes("youtube.com") || movie.trailerLink.includes("youtu.be")) {
      return movie.trailerLink.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/");
    }
    return movie.trailerLink;
  })();

  return (
    <div className="movie-details-page">
      <div className="md-trailer">
        {trailerEmbed ? (
          <iframe
            src={trailerEmbed}
            title={`${movie.title} trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="no-trailer">Trailer not available</div>
        )}
      </div>

      <div className="md-main">
        <div className="md-left">
          <img src={movie.poster} alt={movie.title} className="md-poster" />
        </div>

        <div className="md-center">
          <h1 className="md-title">{movie.title}</h1>
          <p><strong>Release date:</strong> {movie.releaseDate}</p>
          <p><strong>Genres:</strong> {movie.genres ? movie.genres.join(", ") : "—"}</p>
          <p className="md-description">{movie.description || ""}</p>
        </div>

        <div className="md-right">
          <div className="md-rating">
            <h3>IMDb Rating</h3>
            <div className="md-rating-value">⭐{rating} / 10.0</div>
          </div>

          <button className="md-back" onClick={() => navigate("/")}>← Вернуться на главную</button>
        </div>
      </div>

      <div className="md-bottom">
        <div className="md-reviews">
          <h3>Отзывы</h3>
          <div className="md-reviews-list">
            {reviews && reviews.length > 0 ? (
              reviews.map((r, i) => (
                <div className="md-review-item" key={i}>
                  <div className="md-review-body">{r.body}</div>
                </div>
              ))
            ) : (
              <div className="md-no-reviews">Пока нет отзывов.</div>
            )}
          </div>

          <div className="md-add-review">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Напишите свой отзыв..."
            />
            <button onClick={submitReview} disabled={submitting || !newReview.trim()}>
              {submitting ? "Отправка..." : "Отправить отзыв"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
