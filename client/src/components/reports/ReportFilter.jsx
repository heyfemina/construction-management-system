import { useState } from "react";

function ReportFilter() {
  const [reportType, setReportType] = useState("");

  const handleFilter = (e) => {
    setReportType(e.target.value);
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          marginBottom: "15px",
          fontSize: "22px",
          fontWeight: "700",
        }}
      >
        Filter Reports
      </h2>

      <select
        value={reportType}
        onChange={handleFilter}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
        }}
      >
        <option value="">Select Report</option>
        <option value="materials">Material Reports</option>
        <option value="vendors">Vendor Reports</option>
        <option value="labour">Labour Reports</option>
        <option value="finance">Financial Reports</option>
      </select>
    </div>
  );
}

export default ReportFilter;