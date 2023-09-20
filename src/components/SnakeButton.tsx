import "css/SnakeButton.css";

interface SnakeButtonProps {
  text: string;
  onClick: () => void;
}

function SnakeButton({ text, onClick }: SnakeButtonProps) {
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
