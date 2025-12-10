import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios-config";
import { AuthContext } from "../context/AuthProvider";
import "../static/CSS/MovieDetails.css";

const MovieDetails = () => {
  const { imdbId } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("...");
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!imdbId) return;
    
    setLoading(true);

    api.get(`/api/v1/movies/${imdbId}`)
      .then(res => {
        let movieData = null;
        const data = res.data;
        if (data && data.imdbId) {
            movieData = data;
        } else if (data && data.present && data.value) {
            movieData = data.value;
        } else if (data && data.value) {
            movieData = data.value;
        }
        setMovie(movieData);
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
    if (!auth.token) {
        navigate("/login");
        return;
    }

    if (!newReview.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/api/v1/reviews", { 
        reviewBody: newReview.trim(), imdbId 
      });
      const resp = await api.get(`/api/v1/reviews/movie/${imdbId}`);

      setReviews(resp.data || []);
      setNewReview("");
      
    } catch (err) {
      console.error("submit review error", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
        await api.delete(`/api/v1/reviews/${reviewId}`);
        setReviews((prev) => prev.filter((r) => {
            const currentId = typeof r.id === 'object' ? r.id.toString() : r.id;
            const targetId = typeof reviewId === 'object' ? reviewId.toString() : reviewId;
            return currentId !== targetId;
        }));
    } catch (err) {
        console.error("Failed to delete review", err);
        alert("Failed to delete review. Ensure you are an Admin.");
    }
  };

  if (loading) return <div className="md-loading">Loading movie...</div>;
  if (!movie) return <div className="md-no-movie">Movie not found</div>;

  const trailerEmbed = (() => {
    if (!movie.trailerLink) return null;
    if (movie.trailerLink.includes("youtube.com") || movie.trailerLink.includes("youtu.be")) {
      return movie.trailerLink.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/");
    }
    return movie.trailerLink;
  })();

  const isAdmin = auth?.roles && auth.roles.includes("ADMIN");

  return (
    <div className="movie-details-page">
      <div className="md-media-section" style={{ width: '100%', maxWidth: '100%', display: 'flex', justifyContent: 'center', backgroundColor: '#000' }}>
        {movie.streamingUrl ? (
          <div className="video-player-container" style={{ width: '100%', maxWidth: '1200px', padding: '20px 0' }}>
            <video 
                width="100%" 
                height="auto" 
                controls 
                autoPlay={false}
                controlsList="nodownload"
                poster={movie.backdrops?.[0] || movie.poster}
                style={{ borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', maxHeight: '80vh' }}
            >
                <source src={movie.streamingUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="md-trailer" style={{ width: '100%' }}>
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
        )}
      </div>
      
      <div className="md-main">
        <div className="md-left">
          <img src={movie.poster} alt={movie.title} className="md-poster" />
        </div>

        <div className="md-center">
          <h1 className="md-title">{movie.title}</h1>
          <p><strong>Release date: </strong> {movie.releaseDate}</p> <br />
          <p><strong>Genres: </strong> {movie.genres ? movie.genres.join(", ") : "—"}</p>
          <br />
          <p className="md-description"><strong>Description: <br /></strong>{movie.description || ""}</p>
        </div>

        <div className="md-right">
          <div className="md-rating">
            <h3>IMDb Rating</h3>
            <div className="md-rating-value">⭐{rating} / 10.0</div>
          </div>

          <button className="md-back" onClick={() => navigate("/")}>← Back to main page</button>
        </div>
      </div>

      <div className="md-bottom">
        <div className="md-reviews">
          <h3>Reviews</h3>
          <div className="md-reviews-list">
            {reviews && reviews.length > 0 ? (
              reviews.map((r, i) => {
                const reviewId = r.id;
                
                return (
                    <div className="md-review-item" key={reviewId || i}>
                        <div className="md-review-content" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <div className="md-review-name"
                              style={{ color: '#ff4d4d', 
                              fontWeight: 'bold',
                              marginBottom: '10px',
                              fontSize: '1rem', 
                              alignSelf: 'flex-start'}}>
                                {r.username || "Anonymous"}
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <div className="md-review-body">{r.body}</div>
                                
                                {isAdmin && (
                                    <button 
                                        onClick={() => handleDeleteReview(reviewId)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: '1px solid #ff4d4d',
                                            color: '#ff4d4d',
                                            borderRadius: '4px',
                                            padding: '2px 8px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            marginLeft: '15px',
                                            alignSelf: 'flex-start'
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
              })
            ) : (
              <div className="md-no-reviews">No reviews yet.</div>
            )}
          </div>

          <div className="md-add-review">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder={auth.token ? "Write your review..." : "Please login to write a review"}
            />
            <button onClick={submitReview} disabled={submitting || !newReview.trim()}>
              {submitting ? "Sending..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;