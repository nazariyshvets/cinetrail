import "css/WatchlistThumbnail.css";
import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { isMobile, isTablet } from "react-device-detect";

interface WatchlistThumbnailProps {
  id: number;
  img: string;
  title: string;
  onRemove: () => void;
}

const displayed = isMobile || isTablet ? "displayed" : "";

function WatchlistThumbnail({
  id,
  img,
  title,
  onRemove,
}: WatchlistThumbnailProps) {
  function handleRemove(
    event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
  ) {
    event.preventDefault();
    event.stopPropagation();
    onRemove();
  }

  return (
    <Link to={`/movie/${id}`} className="watchlist-thumbnail">
      <img
        src={img}
        alt="movie"
        className="watchlist-thumbnail--img"
        draggable="false"
      />

      <h3 className="watchlist-thumbnail--title">{title}</h3>

      <span
        className={`watchlist-thumbnail--trash-can ${displayed}`}
        onClick={handleRemove}
      >
        <i className="fa-solid fa-trash-can"></i>
      </span>
    </Link>
  );
}

export default WatchlistThumbnail;
