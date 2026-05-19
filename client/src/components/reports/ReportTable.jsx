function ReportTable() {
  const reports = [
    {
      report: "Material Report",
      site: "Site A",
      date: "2025-07-01",
    },
    {
      report: "Vendor Report",
      site: "Site B",
      date: "2025-07-02",
    },
    {
      report: "Labour Report",
      site: "Site C",
      date: "2025-07-03",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        overflowX: "auto",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Reports List
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={tableHead}>Report Name</th>
            <th style={tableHead}>Site</th>
            <th style={tableHead}>Date</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((item, index) => (
            <tr key={index}>
              <td style={tableData}>{item.report}</td>
              <td style={tableData}>{item.site}</td>
              <td style={tableData}>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableHead = {
  borderBottom: "1px solid #d1d5db",
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#f3f4f6",
};

const tableData = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px",
};

export default ReportTable;