import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebaseConfig";
import { TrContext } from "./TrContext";
import { AuthContextTr } from "../translations/translations";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const { langCode } = useContext(TrContext);

  function registerUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) =>
        setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          watchlist: [],
          images: [],
        })
      )
      .catch((error) => {
        alert(
          `${AuthContextTr.signupError[langCode]} ${error.code} ${error.message}`
        );
        console.error(`Registration error: ${error.code} ${error.message}`);
      });
  }

  function signInUser(email, password) {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      alert(
        `${AuthContextTr.signinError[langCode]} ${error.code} ${error.message}`
      );
      console.error(`Sign-in error: ${error.code} ${error.message}`);
    });
  }

  function signOutUser() {
    signOut(auth).catch((error) => {
      alert(
        `${AuthContextTr.signoutError[langCode]} ${error.code} ${error.message}`
      );
      console.error(`Sign-out error: ${error.code} ${error.message}`);
    });
  }

  function signInUserWithGooglePopup() {
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const docRef = doc(db, "users", result.user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setDoc(doc(db, "users", result.user.uid), {
            email: result.user.email,
            watchlist: [],
            images: [],
            selectedImage: "",
          });
        }
      })
      .catch((error) => {
        alert(
          `${AuthContextTr.signinError[langCode]} ${error.code} ${error.message}`
        );
        console.error(`Sign-in error: ${error.code} ${error.message}`);
      });
  }

  function signInUserWithGoogleRedirect() {
    signInWithRedirect(auth, googleProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerUser,
        signInUser,
        signOutUser,
        signInUserWithGooglePopup,
        signInUserWithGoogleRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
