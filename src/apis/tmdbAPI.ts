import LanguageCode from "types/LanguageCode";

interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

const apiKey = "apiKey";

async function getGenres(langCode: LanguageCode = "uk-UA") {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=${langCode}`
    );
    const data = await response.json();

    return data.genres;
  } catch (error) {
    console.error(error);
  }
}

async function getMovies(
  genreId: number,
  quantity: number,
  langCode: LanguageCode = "uk-UA"
) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&with_genres=${genreId.toString()}&page=1&language=${langCode}`
    );
    const data = await response.json();

    return data.results.slice(0, quantity);
  } catch (error) {
    console.error(error);
  }
}

async function getMoviesByIds(ids: number[], langCode: LanguageCode = "uk-UA") {
  try {
    const promises = ids.map((id) =>
      fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=${langCode}`
      ).then((response) => response.json())
    );
    const moviesData = await Promise.all(promises);

    return moviesData;
  } catch (error) {
    console.error("Error fetching movies data:", error);

    return [];
  }
}

async function getMovieDetails(
  movieId: number,
  langCode: LanguageCode = "uk-UA"
) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=${langCode}`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getMovieVideos(movieId: number) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
    );
    const data = await response.json();

    return data.results;
  } catch (error) {
    console.error(error);
  }
}

function getYoutubeTrailerId(videos: Video[]) {
  const trailerVideos = videos.filter(
    ({ site, type }) =>
      site === "YouTube" && (type === "Trailer" || type === "Teaser")
  );
  const officialTrailer = trailerVideos.find(({ official }) => official);

  if (officialTrailer) {
    return officialTrailer.key;
  }

  const firstTrailer = trailerVideos[0];

  if (firstTrailer) {
    return firstTrailer.key;
  }

  return null;
}

async function searchMovies(
  query: string,
  page: number = 1,
  langCode: LanguageCode = "uk-UA"
) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
    query
  )}&page=${page}&language=${langCode}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
  }
}

async function getPopularMovies(
  page: number = 1,
  langCode: LanguageCode = "uk-UA"
) {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}&language=${langCode}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
}

async function getGenreMovies(
  genreId: string,
  page: number = 1,
  langCode: LanguageCode = "uk-UA"
) {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}&language=${langCode}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.results;
  } catch (error) {
    console.error("Error fetching genre movies:", error);
  }
}

export {
  getGenres,
  getMovies,
  getMoviesByIds,
  getMovieDetails,
  getMovieVideos,
  getYoutubeTrailerId,
  searchMovies,
  getPopularMovies,
  getGenreMovies,
};
