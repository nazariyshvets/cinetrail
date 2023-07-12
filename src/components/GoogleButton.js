import { useContext } from "react";
import { TrContext } from "../contexts/TrContext";
import { GoogleButtonTr } from "../translations/translations";
import "../styles/GoogleButton.css";

function GoogleButton({ onClick }) {
  const { langCode } = useContext(TrContext);

  return (
    <button className="google-button" onClick={onClick}>
      <i className="fa-brands fa-google google-button--icon"></i>
      <p className="google-button--text">{GoogleButtonTr.text[langCode]}</p>
    </button>
  );
}

export default GoogleButton;
