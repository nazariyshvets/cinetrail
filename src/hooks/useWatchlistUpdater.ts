import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { useAlert } from "react-alert";
import { db } from "firebaseConfig";
import useAuth from "./useAuth";
import useTr from "./useTr";
import { useWatchlistUpdaterTr } from "translations/miscTr";

const useWatchlistUpdater = () => {
  const { user } = useAuth();
  const { langCode } = useTr();
  const alert = useAlert();

  async function addToWatchlist(id: number) {
    if (user) {
      const docRef = doc(db, "users", user.uid);

      try {
        await setDoc(docRef, { watchlist: arrayUnion(id) }, { merge: true });
        alert.success(useWatchlistUpdaterTr.added[langCode]);
      } catch (error) {
        alert.error(useWatchlistUpdaterTr.notAdded[langCode]);
        console.error(error);
      }
    } else {
      alert.error(useWatchlistUpdaterTr.noUser[langCode]);
    }
  }

  return addToWatchlist;
};

export default useWatchlistUpdater;
