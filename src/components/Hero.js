import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { TrContext } from "../contexts/TrContext";
import { HeroTr } from "../translations/translations";
import useWatchlistUpdater from "../hooks/useWatchlistUpdater";
import "../styles/Hero.css";

function Hero({ id, img, title, desc }) {
  const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
  const { langCode } = useContext(TrContext);
  const addToWatchlist = useWatchlistUpdater();

  return (
    <div className="hero">
      <img src={img} className="hero--img" alt="hero" />
      <h1 className="hero--title">{title}</h1>
      <p className="hero--desc">{desc}</p>
      <div className="hero--buttons">
        <Link to={`/movie/${id}`} className="hero--play">
          <i className="fa-solid fa-play"></i>&nbsp;{HeroTr.play[langCode]}
        </Link>
        <button
          className="hero--watch-later"
          onClick={() => {
            if (isAddedToWatchlist) {
              alert(HeroTr.alreadyAdded[langCode]);
            } else {
              addToWatchlist(id).then(() => setIsAddedToWatchlist(true));
            }
          }}
        >
          <i className="fa-regular fa-clock"></i>&nbsp;
          {HeroTr.watchLater[langCode]}
        </button>
      </div>
      <img
        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
        className="hero--tmdb-logo"
        alt="The Movie DB"
        draggable="false"
      />
    </div>
  );
}

export default Hero;
