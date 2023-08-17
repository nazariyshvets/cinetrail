import { useRef, useContext } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import Login from "../components/Login";
import Signup from "../components/Signup";
import StarryBackground from "../components/StarryBackground";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/LoginSignupPage.css";

function LoginSignupPage() {
  const { user } = useContext(AuthContext);
  const contentRef = useRef(null);

  function setContainer(toLogin) {
    const scrollLeftOffset = toLogin ? 0 : 2 * contentRef.current.clientWidth;

    contentRef.current.scrollTo({
      left: scrollLeftOffset,
      behavior: "smooth",
    });
  }

  return (
    <div className="login-signup-page">
      {user && <Navigate to="/home" replace={true} />}

      <Header />
      <StarryBackground />
      <div className="login-signup-page--content" ref={contentRef}>
        <Login onSetContainer={() => setContainer(false)} />
        <Signup onSetContainer={() => setContainer(true)} />
      </div>
    </div>
  );
}

export default LoginSignupPage;
