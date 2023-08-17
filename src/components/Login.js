import { useState, useContext, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { getRedirectResult } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import GoogleButton from "./GoogleButton";
import { auth, db } from "../firebaseConfig";
import { AuthContext } from "../contexts/AuthContext";
import { TrContext } from "../contexts/TrContext";
import { LoginTr, AuthContextTr } from "../translations/translations";

function Login({ onSetContainer }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    signInUser,
    signInUserWithGooglePopup,
    signInUserWithGoogleRedirect,
  } = useContext(AuthContext);
  const { langCode } = useContext(TrContext);

  function handleSigningIn(event) {
    event.preventDefault();
    signInUser(email, password);
  }

  function handleSigningInWithGoogle() {
    if (isMobile) {
      signInUserWithGoogleRedirect();
      localStorage.setItem("isRedirected", "true");
    } else {
      signInUserWithGooglePopup();
    }
  }

  useEffect(() => {
    const isRedirected = JSON.parse(localStorage.getItem("isRedirected"));

    if (isRedirected) {
      localStorage.removeItem("isRedirected");

      getRedirectResult(auth)
        .then(async (result) => {
          const docRef = doc(db, "users", result.user.uid);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            setDoc(doc(db, "users", result.user.uid), {
              email: result.user.email,
              watchlist: [],
              images: [],
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
  }, [langCode]);

  return (
    <div className="login">
      <h1 className="login--title">{LoginTr.title[langCode]}</h1>
      <form
        method="post"
        className="login--form"
        autoComplete="off"
        onSubmit={(event) => handleSigningIn(event)}
      >
        <div className="login--input-wrapper">
          <div className="login--icon-wrapper">
            <i className="fa-solid fa-user"></i>
          </div>
          <input
            type="email"
            className={`login--input ${email ? "filled" : ""}`}
            name="email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
          <label>{LoginTr.email[langCode]}</label>
        </div>

        <div className="login--input-wrapper">
          <div className="login--icon-wrapper">
            <i className="fa-solid fa-lock"></i>
          </div>
          <input
            type="password"
            className={`login--input ${password ? "filled" : ""}`}
            name="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
          <label>{LoginTr.password[langCode]}</label>
        </div>

        <button className="login--login-button">
          {LoginTr.logIn[langCode]}
        </button>
      </form>

      <p className="login--no-account">
        {LoginTr.noAccount[langCode]}&nbsp;
        <button className="login--signup" onClick={onSetContainer}>
          {LoginTr.signUp[langCode]}
        </button>
      </p>

      <span className="login--separator"></span>

      <GoogleButton onClick={handleSigningInWithGoogle} />
    </div>
  );
}

export default Login;
