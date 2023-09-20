import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile, isTablet } from "react-device-detect";
import { getRedirectResult } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAlert } from "react-alert";
import GoogleButton from "./GoogleButton";
import { auth, db } from "firebaseConfig";
import useAuth from "hooks/useAuth";
import useTr from "hooks/useTr";
import { LoginTr } from "translations/componentsTr";
import { AuthContextTr } from "translations/miscTr";

interface LoginProps {
  onSetContainer: () => void;
}

function Login({ onSetContainer }: LoginProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const {
    signInUser,
    signInUserWithGooglePopup,
    signInUserWithGoogleRedirect,
  } = useAuth();
  const { langCode } = useTr();
  const alert = useAlert();
  const navigate = useNavigate();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  async function handleSigningIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoggingIn) {
      return;
    }

    setIsLoggingIn(true);

    try {
      await signInUser(formData.email, formData.password);
      navigate("/home");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleSigningInWithGoogle() {
    if (isMobile || isTablet) {
      signInUserWithGoogleRedirect();
      localStorage.setItem("isRedirected", "true");
      return;
    }

    if (isLoggingIn) {
      return;
    }

    setIsLoggingIn(true);

    try {
      await signInUserWithGooglePopup();
      navigate("/home");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  }

  useEffect(() => {
    const isRedirected = JSON.parse(
      localStorage.getItem("isRedirected") || "false"
    );

    if (isRedirected) {
      localStorage.removeItem("isRedirected");

      getRedirectResult(auth)
        .then(async (result) => {
          if (!result) {
            return;
          }

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
          const errorCode: keyof typeof AuthContextTr = error.code;
          const errorMessage = error.message;

          if (AuthContextTr[errorCode]) {
            alert.error(AuthContextTr[errorCode][langCode]);
          } else {
            alert.error(errorMessage);
          }

          console.error(`Sign-in error: ${error.code} ${error.message}`);
        });
    }
  }, [alert, langCode]);

  return (
    <div className="login">
      <h1 className="login--title">{LoginTr.title[langCode]}</h1>

      <form
        method="post"
        className="login--form"
        autoComplete="off"
        onSubmit={handleSigningIn}
      >
        <div className="login--input-wrapper">
          <div className="login--icon-wrapper">
            <i className="fa-solid fa-user"></i>
          </div>

          <input type="email" style={{ display: "none" }} />
          <input type="password" style={{ display: "none" }} />

          <input
            type="email"
            className={`login--input ${formData.email ? "filled" : ""}`}
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
          />

          <label>{LoginTr.email[langCode]}</label>
        </div>

        <div className="login--input-wrapper">
          <div className="login--icon-wrapper">
            <i className="fa-solid fa-lock"></i>
          </div>

          <input
            type="password"
            className={`login--input ${formData.password ? "filled" : ""}`}
            name="password"
            value={formData.password}
            autoComplete="new-password"
            required
            onChange={handleChange}
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
