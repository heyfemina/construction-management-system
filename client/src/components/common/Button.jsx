function Button({
  title,
  onClick,
  type = "button",
  bgColor = "#2563eb",
  textColor = "#ffffff",
  width = "100%",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        width: width,
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
      }}
    >
      {title}
    </button>
  );
}

export default Button;