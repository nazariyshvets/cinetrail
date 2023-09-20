import "css/MoviePage.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "react-loading";
import {
  getMovieDetails,
  getMovieVideos,
  getYoutubeTrailerId,
} from "apis/tmdbAPI";
import useTr from "hooks/useTr";
import useDocumentTitle from "hooks/useDocumentTitle";
import MovieDetail from "types/MovieDetail";
import { MoviePageTr } from "translations/pagesTr";

function MoviePage() {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [youtubeTrailerId, setYoutubeTrailerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { langCode } = useTr();
  const { id } = useParams();

  useDocumentTitle(MoviePageTr.title[langCode]);

  useEffect(() => {
    if (id) {
      getMovieDetails(Number(id), langCode)
        .then((data) => setMovie(data))
        .catch((error) => console.error(error));
    }
  }, [id, langCode]);

  useEffect(() => {
    if (id) {
      getMovieVideos(Number(id))
        .then((videos) => getYoutubeTrailerId(videos))
        .then((trailerId) => setYoutubeTrailerId(trailerId))
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const title = movie?.title;
  const overview = movie?.overview;
  const companies = movie?.production_companies
    ?.map((company) => company.name)
    .join(" & ");
  const releaseDate = movie?.release_date;

  return (
    <div className="movie-page">
      <section className="movie-page--main">
        <Link to="/home" className="movie-page--back">
          <i className="fa-solid fa-arrow-left-long"></i>&nbsp;
          {MoviePageTr.home[langCode]}
        </Link>

        {isLoading ? (
          <div className="movie-page--loading-wrapper">
            <Loading type="spinningBubbles" color="#fff" />
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

        {title && <h2 className="movie-page--title">{title}</h2>}
        {overview && <p className="movie-page--desc">{overview}</p>}
        {companies && (
          <p className="movie-page--companies">
            {MoviePageTr.companies[langCode]}:&nbsp;{companies}
          </p>
        )}
        {releaseDate && (
          <p className="movie-page--release-date">
            {MoviePageTr.releaseDate[langCode]}:&nbsp;{releaseDate}
          </p>
        )}
      </section>
    </div>
  );
}

export default MoviePage;
