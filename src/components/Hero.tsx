import "css/Hero.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { useWindowSize } from "usehooks-ts";
import useTr from "hooks/useTr";
import useWatchlistUpdater from "hooks/useWatchlistUpdater";
import Movie from "types/Movie";
import {
  BASE_IMAGE_URL,
  DEFAULT_THUMBNAIL_IMAGE,
  DESKTOP_WIDTH_THRESHOLD,
  MOBILE_WIDTH_THRESHOLD,
  HERO_IMG_WIDTH_DESKTOP,
  HERO_IMG_WIDTH_TABLET,
  HERO_IMG_WIDTH_MOBILE,
} from "constants/constants";
import { HeroTr } from "translations/componentsTr";

interface HeroProps {
  movie: Movie;
}

function Hero({ movie }: HeroProps) {
  const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
  const { width: windowWidth } = useWindowSize();
  const addToWatchlist = useWatchlistUpdater();
  const { langCode } = useTr();
  const alert = useAlert();

  async function handleAddToWatchlist() {
    if (isAddedToWatchlist) {
      alert.info(HeroTr.alreadyAdded[langCode]);
      return;
    }

    try {
      await addToWatchlist(movie.id);
      setIsAddedToWatchlist(true);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  }

  const id = movie.id;
  const imgWidth =
    windowWidth > DESKTOP_WIDTH_THRESHOLD
      ? HERO_IMG_WIDTH_DESKTOP
      : windowWidth > MOBILE_WIDTH_THRESHOLD
      ? HERO_IMG_WIDTH_TABLET
      : HERO_IMG_WIDTH_MOBILE;
  const img =
    movie.backdrop_path || movie.poster_path
      ? `${BASE_IMAGE_URL}${imgWidth}${
          movie.backdrop_path || movie?.poster_path
        }`
      : DEFAULT_THUMBNAIL_IMAGE;
  const title = movie.title;
  const desc = movie.overview;

  return (
    <div className="hero">
      <img src={img} alt="hero" className="hero--img" />

      <img
        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
        alt="The Movie DB"
        className="hero--tmdb-logo"
        draggable="false"
      />

      <h1 className="hero--title">{title}</h1>

      <p className="hero--desc">{desc}</p>

      <div className="hero--buttons">
        <Link to={`/movie/${id}`} className="hero--play">
          <i className="fa-solid fa-play"></i>&nbsp;{HeroTr.play[langCode]}
        </Link>

        <button className="hero--watch-later" onClick={handleAddToWatchlist}>
          <i className="fa-regular fa-clock"></i>&nbsp;
          {HeroTr.watchLater[langCode]}
        </button>
      </div>
    </div>
  );
}

export default Hero;
