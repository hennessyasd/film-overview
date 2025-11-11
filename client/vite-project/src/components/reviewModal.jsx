import { useState } from "react";
import { Modal, Box, Typography, Button, TextField, Chip } from "@mui/material";
import api from "../api/axios-config";
import "../static/CSS/ReviewModal.css";

const ReviewModal = ({ open, onClose, movie }) => {
  const [reviewText, setReviewText] = useState("");
  const [message, setMessage] = useState("");

  if (!movie) return null;

  const handleSubmit = async () => {
    if (!reviewText.trim()) {
      setMessage("Please write a review before submitting.");
      return;
    }

    try {
      await api.post("/api/v1/reviews", {
        reviewBody: reviewText,
        imdbId: movie.imdbId,
      });
      setMessage("Review submitted successfully!");
      setReviewText("");
    } catch (e) {
      console.error("Error submitting review:", e);
      setMessage("Error submitting review. Try again later.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="review-modal">
        <img src={movie.poster} alt={movie.title} className="review-poster" />

        <Typography variant="h5" className="review-title">
          {movie.title}
        </Typography>

        <Typography variant="subtitle1" className="review-info">
          Release Date: {movie.releaseDate}
        </Typography>

        <div className="review-genres">
          {movie.genres.map((genre, id) => (
            <Chip key={id} label={genre} color="primary" variant="outlined" />
          ))}
        </div>

        <TextField
          label="Your Review"
          multiline
          rows={4}
          fullWidth
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          variant="outlined"
          className="review-input"
        />

        {message && <Typography className="review-message">{message}</Typography>}

        <div className="review-buttons">
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" color="error" onClick={onClose}>
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ReviewModal;
