import {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { debounce } from "lodash";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Thumbnail from "../components/Thumbnail";
import {
  searchMovies,
  getPopularMovies,
  getGenreMovies,
} from "../apis/tmdbAPI";
import { TrContext } from "../contexts/TrContext";
import {
  BASE_IMAGE_URL,
  DEFAULT_THUMBNAIL_IMAGE,
} from "../constants/constants";
import { MoviesPageTr } from "../translations/translations";
import "../styles/MoviesPage.css";

// TMDB page currently contains data about 20 movies
// So there're 100 movies per page
const tmdbPagesPerPage = 5;
const thumbnailImgWidth = "w300";

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fetchMoviesRef = useRef(0);
  const tmdbPageRef = useRef(0);
  const { langCode } = useContext(TrContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const genre = searchParams.get("genre");
  const genreId = searchParams.get("genreId");

  const debouncedSearch = useMemo(
    () =>
      debounce(() => {
        tmdbPageRef.current = 0;
        fetchMoviesRef.current(false);
      }, 500),
    []
  );

  const fetchMovies = useCallback(
    async (appendData) => {
      setIsLoading(true);
      const currentPage = tmdbPageRef.current + 1;
      tmdbPageRef.current = currentPage;

      try {
        let data = [];

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
      tmdbPageRef.current > tmdbPagesPerPage
    ) {
      window.scrollTo({ top: 0 });
      tmdbPageRef.current -= 2 * tmdbPagesPerPage;
      fetchMoviesRef.current(false);
    }
  }

  function setNextPage() {
    if (tmdbPageRef.current % tmdbPagesPerPage === 0) {
      window.scrollTo({ top: 0 });
      fetchMoviesRef.current(false);
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
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchMoviesRef.current(true);
      }
    }, 500);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    debouncedSearch();
  }, [debouncedSearch, searchQuery]);

  const title =
    genre?.charAt(0).toUpperCase() + genre?.slice(1) ||
    MoviesPageTr.search[langCode];
  const thumbnails = movies.map((movie, index) => (
    <Thumbnail
      key={index}
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
  const displayPagination =
    tmdbPageRef.current % tmdbPagesPerPage === 0 && movies.length > 0;

  return (
    <div className="movies-page">
      <Header />
      <h1 className="movies-page--title">{title}</h1>
      {!genre && (
        <form className="movies-page--form" autoComplete="off">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={`${MoviesPageTr.search[langCode]}...`}
            autoFocus
          />
        </form>
      )}
      <div className="movies-page--thumbnails">{thumbnails}</div>
      {isLoading && (
        <p className="movies-page--loading">{MoviesPageTr.loading[langCode]}</p>
      )}
      {displayPagination && (
        <div className="movies-page--pagination">
          <span className="movies-page--pagination--prev" onClick={setPrevPage}>
            <i className="fa-solid fa-circle-chevron-left"></i>
          </span>
          <span className="movies-page--pagination--current-page">
            {getCurrentPage()}
          </span>
          <span className="movies-page--pagination--next" onClick={setNextPage}>
            <i className="fa-solid fa-circle-chevron-right"></i>
          </span>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;
