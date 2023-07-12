import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { TrContext } from "../contexts/TrContext";
import { ThumbnailTr } from "../translations/translations";
import useWatchlistUpdater from "../hooks/useWatchlistUpdater";
import "../styles/Thumbnail.css";

function Thumbnail({ id, img, title }) {
  const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
  const { langCode } = useContext(TrContext);
  const addToWatchlist = useWatchlistUpdater();

  return (
    <div className="thumbnail">
      <img
        src={img}
        className="thumbnail--img"
        alt="thumbnail"
        draggable="false"
      />
      <h3 className="thumbnail--title">{title}</h3>
      <div className="thumbnail--overlay">
        <Link to={`/movie/${id}`} className="thumbnail--overlay--button">
          <i className="fa-solid fa-play icon"></i>
          <p className="thumbnail--overlay--tooltip">
            {ThumbnailTr.play[langCode]}
          </p>
        </Link>
        <button
          className={`thumbnail--overlay--button ${
            isAddedToWatchlist ? "added" : ""
          }`}
          onClick={() => {
            if (isAddedToWatchlist) {
              alert(ThumbnailTr.alreadyAdded[langCode]);
            } else {
              addToWatchlist(id).then(() => setIsAddedToWatchlist(true));
            }
          }}
        >
          {isAddedToWatchlist ? (
            <>
              <i className="fa-solid fa-check icon"></i>
              <p className="thumbnail--overlay--tooltip">
                {ThumbnailTr.added[langCode]}
              </p>
            </>
          ) : (
            <>
              <i className="fa-regular fa-clock icon"></i>
              <p className="thumbnail--overlay--tooltip">
                {ThumbnailTr.watchLater[langCode]}
              </p>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Thumbnail;
