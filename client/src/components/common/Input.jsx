function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          outline: "none",
          fontSize: "15px",
        }}
      />
    </div>
  );
}   

export default Input;