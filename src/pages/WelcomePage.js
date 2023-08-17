import { useRef, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import Typed from "typed.js";
import Header from "../components/Header";
import StarryBackground from "../components/StarryBackground";
import { AuthContext } from "../contexts/AuthContext";
import { TrContext } from "../contexts/TrContext";
import { WelcomePageTr } from "../translations/translations";
import "../styles/WelcomePage.css";
import logo from "../images/big_logo.png";

function WelcomePage() {
  const { user } = useContext(AuthContext);
  const { langCode } = useContext(TrContext);
  const typedRef = useRef(null);

  useEffect(() => {
    const options = {
      strings: [WelcomePageTr.welcome[langCode]],
      typeSpeed: 150,
      onComplete: () => {
        const cursor = typedRef.current.nextElementSibling;
        cursor.style.display = "none";
      },
    };

    const typed = new Typed(typedRef.current, options);

    return () => typed.destroy();
  }, [langCode]);

  return (
    <div className="welcome-page">
      {user && <Navigate to="/home" replace={true} />}

      <Header />
      <StarryBackground />
      <img
        src={logo}
        className="welcome-page--logo"
        alt="logo"
        draggable="false"
      />
      <h1 className="welcome-page--title">
        <span ref={typedRef}></span>
      </h1>
      <p className="welcome-page--desc">{WelcomePageTr.desc[langCode]}</p>
      <Link to="/login-signup" className="welcome-page--get-started">
        {WelcomePageTr.getStarted[langCode]}
      </Link>
    </div>
  );
}

export default WelcomePage;
