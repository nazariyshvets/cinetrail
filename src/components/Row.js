import { useRef } from "react";
import { Link } from "react-router-dom";
import Thumbnail from "./Thumbnail";
import {
  BASE_IMAGE_URL,
  DEFAULT_THUMBNAIL_IMAGE,
} from "../constants/constants";
import "../styles/Row.css";

const scrollOffset = 300;

function Row({ link, title, movies }) {
  const thumbnailsRef = useRef(null);

  function handleScroll(offset) {
    thumbnailsRef.current.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  }

  const thumbnailImgWidth = window.innerWidth > 768 ? "w300" : "w185";
  const thumbnails = movies?.map((movie) => (
    <Thumbnail
      key={movie.id}
      id={movie.id}
      title={movie.title}
      img={
        movie.backdrop_path || movie.poster_path
          ? `${BASE_IMAGE_URL}${thumbnailImgWidth}${
              movie.backdrop_path || movie.poster_path
            }`
          : DEFAULT_THUMBNAIL_IMAGE
      }
    />
  ));

  return (
    <div className="row">
      <Link to={link} className="row--title">
        {title}
      </Link>
      <div className="row--thumbnails-wrapper">
        <div className="row--thumbnails" ref={thumbnailsRef}>
          {thumbnails}
        </div>
        <div
          className="row--arrow row--arrow-left"
          onClick={() => handleScroll(-scrollOffset)}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div
          className="row--arrow row--arrow-right"
          onClick={() => handleScroll(scrollOffset)}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </div>
      </div>
    </div>
  );
}

export default Row;
