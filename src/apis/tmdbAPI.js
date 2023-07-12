const apiKey = "apiKey";

async function getGenres(langCode = "en-GB") {
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

async function getMovies(genreId, quantity, langCode = "en-GB") {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&with_genres=${genreId}&page=1&language=${langCode}`
    );
    const data = await response.json();
    return data.results.slice(0, quantity);
  } catch (error) {
    console.error(error);
  }
}

async function getMoviesByIds(ids, langCode = "en-GB") {
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
  }
}

async function getMovieDetails(movieId, langCode = "en-GB") {
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

async function getMovieVideos(movieId) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

function getTrailerVideoKey(videos) {
  if (videos.results && videos.results.length > 0) {
    return videos.results[0].key;
  }
  return null;
}

async function searchMovies(query, page, langCode = "en-GB") {
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

async function getPopularMovies(page = 1, langCode = "en-GB") {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}&language=${langCode}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
}

async function getGenreMovies(genreId, page = 1, langCode = "en-GB") {
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
  getTrailerVideoKey,
  searchMovies,
  getPopularMovies,
  getGenreMovies,
};
