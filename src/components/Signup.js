import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { TrContext } from "../contexts/TrContext";
import { SignupTr } from "../translations/translations";

function Signup({ onSetContainer }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { registerUser } = useContext(AuthContext);
  const { langCode } = useContext(TrContext);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== password2) {
      alert(SignupTr.passwordsDoNotMatchError[langCode]);
      return;
    }

    await registerUser(email, password);
  }

  return (
    <div className="signup">
      <h1 className="signup--title">{SignupTr.title[langCode]}</h1>
      <form
        method="post"
        className="signup--form"
        autoComplete="off"
        onSubmit={(event) => handleSubmit(event)}
      >
        <div className="signup--input-wrapper">
          <div className="signup--icon-wrapper">
            <i className="fa-solid fa-envelope"></i>
          </div>
          <input
            type="email"
            className={`signup--input ${email ? "filled" : ""}`}
            name="email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
          <label>{SignupTr.email[langCode]}</label>
        </div>

        <div className="signup--input-wrapper">
          <div className="signup--icon-wrapper">
            <i className="fa-solid fa-lock"></i>
          </div>
          <input
            type="password"
            className={`signup--input ${password ? "filled" : ""}`}
            name="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
          <label>{SignupTr.password[langCode]}</label>
        </div>

        <div className="signup--input-wrapper">
          <div className="signup--icon-wrapper">
            <i className="fa-solid fa-lock"></i>
          </div>
          <input
            type="password"
            className={`signup--input ${password2 ? "filled" : ""}`}
            name="password2"
            value={password2}
            required
            onChange={(event) => setPassword2(event.target.value)}
          />
          <label>{SignupTr.password2[langCode]}</label>
        </div>

        <button className="signup--signup-button">
          {SignupTr.signUp[langCode]}
        </button>
      </form>

      <p className="signup--have-account">
        {SignupTr.haveAccount[langCode]}&nbsp;
        <button className="signup--login" onClick={onSetContainer}>
          {SignupTr.logIn[langCode]}
        </button>
      </p>
    </div>
  );
}

export default Signup;
