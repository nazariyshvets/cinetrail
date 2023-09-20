import "css/MoviesPage.css";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { debounce } from "lodash";
import Thumbnail from "components/Thumbnail";
import { searchMovies, getPopularMovies, getGenreMovies } from "apis/tmdbAPI";
import useTr from "hooks/useTr";
import useDocumentTitle from "hooks/useDocumentTitle";
import Movie from "types/Movie";
import {
  BASE_IMAGE_URL,
  DEFAULT_THUMBNAIL_IMAGE,
  THUMBNAIL_WIDTH_DESKTOP,
} from "constants/constants";
import { MoviesPageTr } from "translations/pagesTr";

interface MoviesPageProps {
  isSearch: boolean;
}

// TMDB page contains data about 20 movies
const moviesNumPerTmdbPage = 20;
// So there're 100 movies per page
const tmdbPagesPerPage = 5;

function MoviesPage({ isSearch }: MoviesPageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fetchMoviesRef = useRef<Function | null>(null);
  const tmdbPageRef = useRef(0);
  const { langCode } = useTr();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const genre = searchParams.get("name");
  const genreId = searchParams.get("id");

  useDocumentTitle(MoviesPageTr.title[langCode]);

  const debouncedSearch = useMemo(
    () =>
      debounce(() => {
        tmdbPageRef.current = 0;

        if (fetchMoviesRef.current) {
          fetchMoviesRef.current();
        }
      }, 500),
    []
  );

  const fetchMovies = useCallback(
    async (appendData: boolean = false) => {
      setIsLoading(true);
      const currentPage = tmdbPageRef.current + 1;
      tmdbPageRef.current = currentPage;

      try {
        let data: Movie[] = [];

        if (genreId) {
          data = await getGenreMovies(genreId, currentPage, langCode);
        } else if (searchQuery) {
          data = await searchMovies(searchQuery, currentPage, langCode);
        } else {
          data = await getPopularMovies(currentPage, langCode);
        }

        setMovies((prevMovies) =>
          appendData ? [...prevMovies, ...data] : data
        );
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [genreId, searchQuery, langCode]
  );

  function getCurrentPage() {
    return Math.ceil(tmdbPageRef.current / tmdbPagesPerPage);
  }

  function setPrevPage() {
    if (
      tmdbPageRef.current % tmdbPagesPerPage === 0 &&
      tmdbPageRef.current > tmdbPagesPerPage &&
      fetchMoviesRef.current
    ) {
      window.scrollTo({ top: 0 });
      tmdbPageRef.current -= 2 * tmdbPagesPerPage;
      fetchMoviesRef.current();
    }
  }

  function setNextPage() {
    if (
      tmdbPageRef.current % tmdbPagesPerPage === 0 &&
      fetchMoviesRef.current
    ) {
      window.scrollTo({ top: 0 });
      fetchMoviesRef.current();
    }
  }

  useEffect(() => {
    fetchMoviesRef.current = fetchMovies;
  }, [fetchMovies]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      // if we've already loaded the content per page then return
      if (tmdbPageRef.current >= tmdbPagesPerPage * getCurrentPage()) {
        return;
      }

      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      // fetch movies if there're less than 100 pixels to the bottom of the page
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        fetchMoviesRef.current
      ) {
        fetchMoviesRef.current(true);
      }
    }, 500);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    debouncedSearch();

    return () => debouncedSearch.cancel();
  }, [debouncedSearch, searchQuery]);

  const title =
    !isSearch && genre
      ? genre.charAt(0).toUpperCase() + genre.slice(1)
      : MoviesPageTr.search[langCode];
  const thumbnails = movies.map((movie, index) => (
    <Thumbnail
      key={index}
      id={movie.id}
      title={movie.title}
      img={
        movie.backdrop_path || movie.poster_path
          ? `${BASE_IMAGE_URL}${THUMBNAIL_WIDTH_DESKTOP}${
              movie.backdrop_path || movie.poster_path
            }`
          : DEFAULT_THUMBNAIL_IMAGE
      }
    />
  ));
  const displayPagination =
    tmdbPageRef.current % tmdbPagesPerPage === 0 && movies.length > 0;
  const displayPrevButton = tmdbPageRef.current > tmdbPagesPerPage;
  const displayNextButton =
    movies.length % (moviesNumPerTmdbPage * tmdbPagesPerPage) === 0;
  const displayCurrentPage =
    movies.length >= moviesNumPerTmdbPage * tmdbPagesPerPage;

  return (
    <div className="movies-page">
      <h1 className="movies-page--title">{title}</h1>

      {isSearch && (
        <form className="movies-page--form" autoComplete="off">
          <input
            type="text"
            className="movies-page--form--input"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={`${MoviesPageTr.search[langCode]}...`}
            autoFocus
          />
        </form>
      )}

      {thumbnails.length > 0 ? (
        <div className="movies-page--thumbnails">{thumbnails}</div>
      ) : (
        <p className="movies-page--no-movies-found">
          {MoviesPageTr.noMoviesFound[langCode]}
        </p>
      )}

      {isLoading && (
        <p className="movies-page--loading">{MoviesPageTr.loading[langCode]}</p>
      )}

      {displayPagination && (
        <div className="movies-page--pagination">
          {displayPrevButton && (
            <span
              className="movies-page--pagination--prev"
              onClick={setPrevPage}
            >
              <i className="fa-solid fa-circle-chevron-left"></i>
            </span>
          )}

          {displayCurrentPage && (
            <span className="movies-page--pagination--current-page">
              {getCurrentPage()}
            </span>
          )}

          {displayNextButton && (
            <span
              className="movies-page--pagination--next"
              onClick={setNextPage}
            >
              <i className="fa-solid fa-circle-chevron-right"></i>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default MoviesPage;
