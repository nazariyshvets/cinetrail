import "css/SkewedButton.css";

interface SkewedButtonProps {
  text: string;
  onClick: () => void;
}

function SkewedButton({ text, onClick }: SkewedButtonProps) {
  return (
    <button className="skewed-button" onClick={onClick}>
      {text}
    </button>
  );
}

export default SkewedButton;
