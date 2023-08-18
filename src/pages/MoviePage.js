import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import ReactLoading from "react-loading";
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
  const [youtubeTrailerId, setYoutubeTrailerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { langCode } = useContext(TrContext);
  const { id } = useParams();

  useEffect(() => {
    getMovieDetails(id, langCode)
      .then((data) => setMovie(data))
      .catch((error) => console.error(error));
  }, [id, langCode]);

  useEffect(() => {
    getMovieVideos(id)
      .then((videos) => getTrailerVideoKey(videos))
      .then((videoKey) => {
        setYoutubeTrailerId(videoKey);
        setIsLoading(false);
      })
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

        {isLoading ? (
          <div className="movie-page--loading-wrapper">
            <ReactLoading type="spinningBubbles" color="#fff" />
          </div>
        ) : youtubeTrailerId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeTrailerId}?rel=0`}
            className="movie-page--trailer"
            title="YouTube Media Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="movie-page--trailer-not-found">
            {MoviePageTr.trailerNotFound[langCode]}
          </div>
        )}

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
