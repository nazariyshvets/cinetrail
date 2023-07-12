import "../styles/SkewedButton.css";

function SkewedButton({ text, onClick }) {
  return (
    <button className="skewed-button" onClick={onClick}>
      {text}
    </button>
  );
}

export default SkewedButton;
