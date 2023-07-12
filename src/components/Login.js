import { useState, useContext } from "react";
import GoogleButton from "./GoogleButton";
import { AuthContext } from "../contexts/AuthContext";
import { TrContext } from "../contexts/TrContext";
import { LoginTr } from "../translations/translations";

function Login({ onSetContainer }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInUser, signInUserWithGoogle } = useContext(AuthContext);
  const { langCode } = useContext(TrContext);

  function handleSigningIn(event) {
    event.preventDefault();
    signInUser(email, password);
  }

  function handleSigningInWithGoogle() {
    signInUserWithGoogle();
  }

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
