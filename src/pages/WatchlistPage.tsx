import "css/WatchlistPage.css";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, arrayRemove } from "firebase/firestore";
import WatchlistThumbnail from "components/WatchlistThumbnail";
import { db } from "firebaseConfig";
import useAuth from "hooks/useAuth";
import useTr from "hooks/useTr";
import useDocumentTitle from "hooks/useDocumentTitle";
import { getMoviesByIds } from "apis/tmdbAPI";
import MovieDetail from "types/Movie";
import {
  BASE_IMAGE_URL,
  DEFAULT_THUMBNAIL_IMAGE,
  THUMBNAIL_WIDTH_DESKTOP,
} from "constants/constants";
import { WacthlistPageTr } from "translations/pagesTr";

function WatchlistPage() {
  const [movies, setMovies] = useState<MovieDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { langCode } = useTr();

  useDocumentTitle(WacthlistPageTr.title[langCode]);

  function removeFromWatchlist(movieId: number) {
    if (!user) {
      return;
    }

    const docRef = doc(db, "users", user.uid);

    setDoc(docRef, { watchlist: arrayRemove(movieId) }, { merge: true });
    setMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== movieId)
    );
  }

  useEffect(() => {
    async function fetchMovies() {
      if (!user) {
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();
      const movieIds = docData ? docData.watchlist : [];

      try {
        const moviesData = await getMoviesByIds(movieIds, langCode);

        setMovies(moviesData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, [user, langCode]);

  const thumbnails = movies.map(({ id, title, backdrop_path, poster_path }) => (
    <WatchlistThumbnail
      key={id}
      id={id}
      title={title}
      img={
        backdrop_path || poster_path
          ? `${BASE_IMAGE_URL}${THUMBNAIL_WIDTH_DESKTOP}${
              backdrop_path || poster_path
            }`
          : DEFAULT_THUMBNAIL_IMAGE
      }
      onRemove={() => removeFromWatchlist(id)}
    />
  ));

  return (
    <div className="watchlist-page">
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
