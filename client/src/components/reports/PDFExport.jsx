import generatePDF from "../../utils/generatePDF";

function PDFExport({
  data = [],
  columns = [],
  fileName = "Report",
}) {
  const handleExport = () => {
    generatePDF(fileName, data, columns);
  };

  return (
    <button
      className="export-button export-button-pdf"
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
