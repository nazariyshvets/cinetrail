import { Link } from "react-router-dom";
import "../styles/WatchlistThumbnail.css";

function WatchlistThumbnail({ id, img, title, onRemoveFromWatchlist }) {
  return (
    <Link to={`/movie/${id}`} className="watchlist-thumbnail">
      <img
        src={img}
        className="watchlist-thumbnail--img"
        alt="movie"
        draggable="false"
      />
      <h3 className="watchlist-thumbnail--title">{title}</h3>
      <span
        className="watchlist-thumbnail--trash-can"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onRemoveFromWatchlist();
        }}
      >
        <i className="fa-solid fa-trash-can"></i>
      </span>
    </Link>
  );
}

export default WatchlistThumbnail;
