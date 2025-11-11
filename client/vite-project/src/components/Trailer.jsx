import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import "../static/CSS/Trailer.css";

const Trailer = () => {
  const { ytTrailerId } = useParams();
  const navigate = useNavigate();

  if (!ytTrailerId) return <p>Trailer not found</p>;

  return (
    <div className="trailer-wrapper">
      <div className="react-player-container">
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${ytTrailerId}`}
          controls
          playing
          width="100%"
          height="100%"
          config={{
            youtube: { playerVars: { modestbranding: 1, rel: 0 } },
          }}
        />
      </div>
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Movies
      </button>
    </div>
  );
};

export default Trailer;
