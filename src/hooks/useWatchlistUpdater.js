import { useContext } from "react";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AuthContext } from "../contexts/AuthContext";
import { TrContext } from "../contexts/TrContext";
import { useWatchlistUpdaterTr } from "../translations/translations";

const useWatchlistUpdater = () => {
  const { user } = useContext(AuthContext);
  const { langCode } = useContext(TrContext);

  async function addToWatchlist(id) {
    if (user) {
      const docRef = doc(db, "users", user.uid);

      try {
        await setDoc(docRef, { watchlist: arrayUnion(id) }, { merge: true });
        alert(useWatchlistUpdaterTr.added[langCode]);
      } catch (error) {
        alert(useWatchlistUpdaterTr.notAdded[langCode]);
        console.error(error);
      }
    } else {
      alert(useWatchlistUpdaterTr.noUser[langCode]);
    }
  }

  return addToWatchlist;
};

export default useWatchlistUpdater;
