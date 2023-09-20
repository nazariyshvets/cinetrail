import "css/GoogleButton.css";
import useTr from "hooks/useTr";
import { GoogleButtonTr } from "translations/componentsTr";

interface GoogleButtonProps {
  onClick: () => void;
}

function GoogleButton({ onClick }: GoogleButtonProps) {
  const { langCode } = useTr();

  return (
    <button className="google-button" onClick={onClick}>
      <i className="fa-brands fa-google google-button--icon"></i>
      <p className="google-button--text">{GoogleButtonTr.text[langCode]}</p>
    </button>
  );
}

export default GoogleButton;
