import "css/WelcomePage.css";
import { useRef, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Typed from "typed.js";
import StarryBackground from "components/StarryBackground";
import useAuth from "hooks/useAuth";
import useTr from "hooks/useTr";
import useDocumentTitle from "hooks/useDocumentTitle";
import { WelcomePageTr } from "translations/pagesTr";

function WelcomePage() {
  const { user } = useAuth();
  const { langCode } = useTr();
  const typedRef = useRef<HTMLSpanElement>(null);

  useDocumentTitle(WelcomePageTr.title[langCode]);

  useEffect(() => {
    const options = {
      strings: [WelcomePageTr.welcome[langCode]],
      typeSpeed: 150,
      onComplete: () => {
        typed.cursor.remove();
      },
    };

    const typed = new Typed(typedRef.current, options);

    return () => typed.destroy();
  }, [langCode]);

  return (
    <div className="welcome-page">
      {user && <Navigate to="/home" replace={true} />}

      <StarryBackground />

      <img
        src="/images/big_logo.png"
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
