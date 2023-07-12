import "../styles/FoldedButton.css";

function FoldedButton({ text, onClick }) {
  return (
    <button className="folded-button" type="button" onClick={onClick}>
      {text}
    </button>
  );
}

export default FoldedButton;
