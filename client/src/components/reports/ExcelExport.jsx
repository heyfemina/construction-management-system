import generateExcel from "../../utils/generateExcel";

function ExcelExport({
  data = [],
  columns = [],
  fileName = "Report",
}) {
  const handleExport = () => {
    generateExcel(data, fileName, columns);
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
