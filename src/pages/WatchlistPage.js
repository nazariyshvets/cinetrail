import { useState, useEffect, useContext } from "react";
import { doc, getDoc, setDoc, arrayRemove } from "firebase/firestore";
import Header from "../components/Header";
import WatchlistThumbnail from "../components/WatchlistThumbnail";
import { db } from "../firebaseConfig";
import { AuthContext } from "../contexts/AuthContext";
import { TrContext } from "../contexts/TrContext";
import {
  BASE_IMAGE_URL,
  DEFAULT_THUMBNAIL_IMAGE,
} from "../constants/constants";
import { WacthlistPageTr } from "../translations/translations";
import { getMoviesByIds } from "../apis/tmdbAPI";
import "../styles/WatchlistPage.css";

const thumbnailImgWidth = "w300";

function WatchlistPage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { langCode } = useContext(TrContext);

  function removeFromWatchlist(movieId) {
    const docRef = doc(db, "users", user.uid);
    setDoc(docRef, { watchlist: arrayRemove(movieId) }, { merge: true });
    setMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== movieId)
    );
  }

  useEffect(() => {
    async function fetchMovies() {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const movieIds = docSnap.data().watchlist;

      setMovies(await getMoviesByIds(movieIds, langCode));
      setIsLoading(false);
    }

    fetchMovies();
  }, [user.uid, langCode]);

  const thumbnails = movies.map((movie, index) => (
    <WatchlistThumbnail
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
      onRemoveFromWatchlist={() => removeFromWatchlist(movie.id)}
    />
  ));

  return (
    <div className="watchlist-page">
      <Header />
      <h1 className="watchlist-page--title">
        {WacthlistPageTr.watchlist[langCode]}
      </h1>
      {isLoading ? (
        <p className="watchlist-page--loading">
          {WacthlistPageTr.loading[langCode]}
        </p>
      ) : movies.length === 0 ? (
        <p className="watchlist-page--no-movies">
          {WacthlistPageTr.noMovies[langCode]}
        </p>
      ) : (
        <div className="watchlist-page--thumbnails">{thumbnails}</div>
      )}
    </div>
  );
}

export default WatchlistPage;
