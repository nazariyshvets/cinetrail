import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import useAuth from "hooks/useAuth";
import useTr from "hooks/useTr";
import { SignupTr } from "translations/componentsTr";

interface SignupProps {
  onSetContainer: () => void;
}

function Signup({ onSetContainer }: SignupProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const { registerUser } = useAuth();
  const { langCode } = useTr();
  const alert = useAlert();
  const navigate = useNavigate();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isRegistering) {
      return;
    }

    if (formData.password !== formData.password2) {
      alert.error(SignupTr.passwordsDoNotMatchError[langCode]);
      console.error("Passwords do not match");
      return;
    }

    setIsRegistering(true);

    try {
      await registerUser(formData.email, formData.password);
      navigate("/home");
    } catch (error) {
      console.error(error);
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <div className="signup">
      <h1 className="signup--title">{SignupTr.title[langCode]}</h1>

      <form
        method="post"
        className="signup--form"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className="signup--input-wrapper">
          <div className="signup--icon-wrapper">
            <i className="fa-solid fa-envelope"></i>
          </div>

          <input
            type="email"
            className={`signup--input ${formData.email ? "filled" : ""}`}
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
          />

          <label>{SignupTr.email[langCode]}</label>
        </div>

        <div className="signup--input-wrapper">
          <div className="signup--icon-wrapper">
            <i className="fa-solid fa-lock"></i>
          </div>

          <input
            type="password"
            className={`signup--input ${formData.password ? "filled" : ""}`}
            name="password"
            value={formData.password}
            autoComplete="new-password"
            required
            onChange={handleChange}
          />

          <label>{SignupTr.password[langCode]}</label>
        </div>

        <div className="signup--input-wrapper">
          <div className="signup--icon-wrapper">
            <i className="fa-solid fa-lock"></i>
          </div>

          <input
            type="password"
            className={`signup--input ${formData.password2 ? "filled" : ""}`}
            name="password2"
            value={formData.password2}
            autoComplete="new-password"
            required
            onChange={handleChange}
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
