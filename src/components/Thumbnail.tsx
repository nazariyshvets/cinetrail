import "css/Thumbnail.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import useTr from "hooks/useTr";
import useWatchlistUpdater from "hooks/useWatchlistUpdater";
import { ThumbnailTr } from "translations/componentsTr";

interface ThumbnailProps {
  id: number;
  img: string;
  title: string;
}

function Thumbnail({ id, img, title }: ThumbnailProps) {
  const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
  const { langCode } = useTr();
  const addToWatchlist = useWatchlistUpdater();
  const alert = useAlert();

  function handleAddToWatchlist() {
    if (isAddedToWatchlist) {
      alert.info(ThumbnailTr.alreadyAdded[langCode]);
    } else {
      addToWatchlist(id)
        .then(() => setIsAddedToWatchlist(true))
        .catch((error) => {
          console.error("Error adding to watchlist:", error);
        });
    }
  }

  return (
    <div className="thumbnail">
      <img
        src={img}
        alt="thumbnail"
        className="thumbnail--img"
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
          onClick={handleAddToWatchlist}
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
