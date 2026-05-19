function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        marginBottom: "20px",
        outline: "none",
      }}
    />
  );
}

export default SearchBar;