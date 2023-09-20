import "css/Row.css";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { isMobile, isTablet } from "react-device-detect";
import { useWindowSize } from "usehooks-ts";
import Thumbnail from "./Thumbnail";
import Movie from "types/Movie";
import {
  BASE_IMAGE_URL,
  DEFAULT_THUMBNAIL_IMAGE,
  TABLET_WIDTH_THRESHOLD,
  THUMBNAIL_WIDTH_DESKTOP,
  THUMBNAIL_WIDTH_MOBILE,
} from "constants/constants";

interface RowProps {
  link: string;
  title: string;
  movies?: Movie[];
}

const scrollOffset = isMobile || isTablet ? 200 : 320;

function Row({ link, title, movies }: RowProps) {
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const { width: windowWidth } = useWindowSize();

  function handleScroll(offset: number) {
    const thumbnails = thumbnailsRef.current;

    if (thumbnails) {
      thumbnails.scrollBy({
        left: offset,
        behavior: "smooth",
      });
    }
  }

  const thumbnailImgWidth =
    windowWidth > TABLET_WIDTH_THRESHOLD
      ? THUMBNAIL_WIDTH_DESKTOP
      : THUMBNAIL_WIDTH_MOBILE;

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
          className={`row--arrow row--arrow-left ${
            isMobile || isTablet ? "displayed" : ""
          }`}
          onClick={() => handleScroll(-scrollOffset)}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div
          className={`row--arrow row--arrow-right ${
            isMobile || isTablet ? "displayed" : ""
          }`}
          onClick={() => handleScroll(scrollOffset)}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </div>
      </div>
    </div>
  );
}

export default Row;
