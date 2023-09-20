import "css/LoginSignupPage.css";
import { useRef } from "react";
import { Navigate } from "react-router-dom";
import Login from "components/Login";
import Signup from "components/Signup";
import StarryBackground from "components/StarryBackground";
import useAuth from "hooks/useAuth";
import useTr from "hooks/useTr";
import useDocumentTitle from "hooks/useDocumentTitle";
import { LoginSignupPageTr } from "translations/pagesTr";

function LoginSignupPage() {
  const { user } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const { langCode } = useTr();

  useDocumentTitle(LoginSignupPageTr.title[langCode]);

  function setContainer(toLogin: boolean) {
    const content = contentRef.current;

    if (content) {
      const scrollLeftOffset = toLogin ? 0 : 2 * content.clientWidth;

      content.scrollTo({
        left: scrollLeftOffset,
        behavior: "smooth",
      });
    }
  }

  return (
    <div className="login-signup-page">
      {user && <Navigate to="/home" replace={true} />}

      <StarryBackground />

      <div className="login-signup-page--content" ref={contentRef}>
        <Login onSetContainer={() => setContainer(false)} />
        <Signup onSetContainer={() => setContainer(true)} />
      </div>
    </div>
  );
}

export default LoginSignupPage;
