import "../css/Button.css";

const Button = ({ content = "", variant = "primary", onClick = () => {} }) => {
  return (
    <button className={`${variant} custom-button`} onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
