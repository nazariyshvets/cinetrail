import "../styles/SnakeButton.css";

function SnakeButton({ text, onClick }) {
  return (
    <button className="snake-button" onClick={onClick}>
      {text}
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}

export default SnakeButton;
