function ExcelExport() {
  const handleExport = () => {
    alert("Excel Export Started");
  };

  return (
    <button
      onClick={handleExport}
      style={{
        backgroundColor: "#059669",
        color: "#ffffff",
        padding: "12px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      Export Excel
    </button>
  );
}

export default ExcelExport;