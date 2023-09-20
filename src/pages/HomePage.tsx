import "css/HomePage.css";
import { useState, useEffect } from "react";
import AppLoading from "components/AppLoading";
import Hero from "components/Hero";
import Row from "components/Row";
import useTr from "hooks/useTr";
import useDocumentTitle from "hooks/useDocumentTitle";
import { getGenres, getMovies } from "apis/tmdbAPI";
import Genre from "types/Genre";
import Movie from "types/Movie";
import { HomePageTr } from "translations/pagesTr";

interface Movies {
  // genre name is a key
  [key: string]: Movie[];
}

function Home() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movies>({});
  const [isLoading, setIsLoading] = useState(true);
  const { langCode } = useTr();

  useDocumentTitle(HomePageTr.title[langCode]);

  function getRandomMovie(genreMovies: Movie[]) {
    const randomIndex = Math.floor(Math.random() * genreMovies.length);

    return genreMovies[randomIndex];
  }

  function getRandomGenreMovie() {
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    const randomMovies = movies[randomGenre?.name] || [];

    return getRandomMovie(randomMovies);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const genresData: Genre[] = await getGenres(langCode);
        const moviesData: Movies = {};

        await Promise.all(
          genresData.map(async (genre) => {
            const genreMovies = await getMovies(genre.id, 10, langCode);
            moviesData[genre.name] = genreMovies;
          })
        );

        setGenres(genresData);
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [langCode]);

  const heroMovie = getRandomGenreMovie();

  const rows = genres.map(({ id, name }) => (
    <Row
      key={id}
      link={`/genre?id=${id}&name=${encodeURIComponent(name.toLowerCase())}`}
      title={name}
      movies={movies[name]}
    />
  ));

  return (
    <div className="home-page">
      {isLoading ? (
        <AppLoading />
      ) : (
        <>
          {heroMovie && <Hero movie={heroMovie} />}

          <div className="home-page--rows">{rows}</div>
        </>
      )}
    </div>
  );
}

export default Home;
