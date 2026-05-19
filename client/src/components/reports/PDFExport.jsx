function PDFExport() {
  const handleExport = () => {
    alert("PDF Export Started");
  };

  return (
    <button
      onClick={handleExport}
      style={{
        backgroundColor: "#dc2626",
        color: "#ffffff",
        padding: "12px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      Export PDF
    </button>
  );
}

export default PDFExport;