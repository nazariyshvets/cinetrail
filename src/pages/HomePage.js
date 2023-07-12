import { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Row from "../components/Row";
import { TrContext } from "../contexts/TrContext";
import { getGenres, getMovies } from "../apis/tmdbAPI";
import {
  BASE_IMAGE_URL,
  DEFAULT_THUMBNAIL_IMAGE,
} from "../constants/constants";
import "../styles/HomePage.css";

function Home() {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState({});
  const { langCode } = useContext(TrContext);

  function getRandomMovie(genreMovies) {
    const randomIndex = Math.floor(Math.random() * genreMovies.length);
    return genreMovies[randomIndex];
  }

  function getRandomGenreMovie(genres, movies) {
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    const randomMovies = movies[randomGenre?.name] || [];
    return getRandomMovie(randomMovies);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genresData = await getGenres(langCode);
        const moviesData = {};

        await Promise.all(
          genresData?.map(async (genre) => {
            const genreMovies = await getMovies(genre.id, 10, langCode);
            moviesData[genre.name] = genreMovies;
          })
        );

        setGenres(genresData);
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [langCode]);

  const windowWidth = window.innerWidth;
  const heroMovie = getRandomGenreMovie(genres, movies);
  const heroId = heroMovie?.id;
  const heroImgWidth =
    windowWidth > 1024 ? "w1280" : windowWidth > 480 ? "w780" : "w500";
  const heroImg =
    heroMovie?.backdrop_path || heroMovie?.poster_path
      ? `${BASE_IMAGE_URL}${heroImgWidth}${
          heroMovie?.backdrop_path || heroMovie?.poster_path
        }`
      : DEFAULT_THUMBNAIL_IMAGE;
  const heroTitle = heroMovie?.title;
  const heroDesc = heroMovie?.overview;

  const rows = genres?.map((genre) => (
    <Row
      key={genre.id}
      link={`/genre?genre=${encodeURIComponent(
        genre.name.toLowerCase()
      )}&genreId=${genre.id}`}
      title={genre.name}
      movies={movies[genre.name]}
    />
  ));

  return (
    <div className="home-page">
      <Header />
      <Hero id={heroId} img={heroImg} title={heroTitle} desc={heroDesc} />
      <div className="home-page--rows">{rows}</div>
    </div>
  );
}

export default Home;
