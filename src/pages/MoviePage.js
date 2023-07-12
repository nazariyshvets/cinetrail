import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import {
  getMovieDetails,
  getMovieVideos,
  getTrailerVideoKey,
} from "../apis/tmdbAPI";
import { TrContext } from "../contexts/TrContext";
import { MoviePageTr } from "../translations/translations";
import "../styles/MoviePage.css";

function MoviePage() {
  const [movie, setMovie] = useState(null);
  const [trailerYoutubeId, setTrailerId] = useState(null);
  const { langCode } = useContext(TrContext);
  const { id } = useParams();

  useEffect(() => {
    getMovieDetails(id, langCode).then((data) => setMovie(data));
  }, [id, langCode]);

  useEffect(() => {
    getMovieVideos(id)
      .then((videos) => getTrailerVideoKey(videos))
      .then((videoKey) => setTrailerId(videoKey))
      .catch((error) => console.error(error));
  }, [id]);

  const companies = movie?.production_companies
    ?.map((company) => company.name)
    .join(" & ");

  return (
    <div className="movie-page">
      <Header />
      <section className="movie-page--main">
        <Link to="/home" className="movie-page--back">
          <i className="fa-solid fa-arrow-left-long"></i>&nbsp;
          {MoviePageTr.home[langCode]}
        </Link>
        <iframe
          src={`https://www.youtube.com/embed/${trailerYoutubeId}?rel=0`}
          className="movie-page--movie"
          title="YouTube Media Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <h2 className="movie-page--title">{movie?.title}</h2>
        <p className="movie-page--desc">{movie?.overview}</p>
        <p className="movie-page--companies">
          {MoviePageTr.companies[langCode]}:&nbsp;{companies}
        </p>
        <p className="movie-page--release-date">
          {MoviePageTr.releaseDate[langCode]}:&nbsp;{movie?.release_date}
        </p>
      </section>
    </div>
  );
}

export default MoviePage;
