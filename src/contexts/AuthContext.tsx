import { createContext, useState, useEffect, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  User,
  UserCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAlert } from "react-alert";
import { auth, googleProvider, db } from "firebaseConfig";
import useTr from "hooks/useTr";
import { AuthContextTr } from "translations/miscTr";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  registerUser: (email: string, password: string) => Promise<User>;
  signInUser: (email: string, password: string) => Promise<UserCredential>;
  signOutUser: () => Promise<void>;
  signInUserWithGooglePopup: () => Promise<void>;
  signInUserWithGoogleRedirect: () => void;
}

interface AuthProviderProps {
  children?: ReactNode;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });
  const { langCode } = useTr();
  const alert = useAlert();

  function registerUser(email: string, password: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          watchlist: [],
          images: [],
          selectedImage: "",
        });
        resolve(userCredential.user);
      } catch (error) {
        const errorCode: keyof typeof AuthContextTr = error.code;
        const errorMessage = error.message;

        if (AuthContextTr[errorCode]) {
          alert.error(AuthContextTr[errorCode][langCode]);
        } else {
          alert.error(errorMessage);
        }

        console.error(`Registration error: ${errorCode} ${errorMessage}`);
        reject(error);
      }
    });
  }

  function signInUser(
    email: string,
    password: string
  ): Promise<UserCredential> {
    return new Promise(async (resolve, reject) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        resolve(userCredential);
      } catch (error) {
        const errorCode: keyof typeof AuthContextTr = error.code;
        const errorMessage = error.message;

        if (AuthContextTr[errorCode]) {
          alert.error(AuthContextTr[errorCode][langCode]);
        } else {
          alert.error(errorMessage);
        }

        console.error(`Sign-in error: ${errorCode} ${errorMessage}`);
        reject(error);
      }
    });
  }

  function signOutUser(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await signOut(auth);
        resolve();
      } catch (error) {
        alert.error(AuthContextTr.signoutError[langCode]);
        console.error(`Sign-out error: ${error.code} ${error.message}`);
        reject(error);
      }
    });
  }

  function signInUserWithGooglePopup(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const docRef = doc(db, "users", result.user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          await setDoc(doc(db, "users", result.user.uid), {
            email: result.user.email,
            watchlist: [],
            images: [],
            selectedImage: "",
          });
        }

        resolve();
      } catch (error) {
        const errorCode: keyof typeof AuthContextTr = error.code;
        const errorMessage = error.message;

        if (AuthContextTr[errorCode]) {
          alert.error(AuthContextTr[errorCode][langCode]);
        } else {
          alert.error(errorMessage);
        }

        console.error(`Sign-in error: ${errorCode} ${errorMessage}`);
        reject(error);
      }
    });
  }

  function signInUserWithGoogleRedirect() {
    signInWithRedirect(auth, googleProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>
      setAuthState({ user, isLoading: false })
    );

    return () => unsubscribe();
  }, [setAuthState]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
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

export { AuthContext, AuthProvider, AuthContextType };
