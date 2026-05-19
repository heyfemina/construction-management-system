function LabourReport() {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Labour Report
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Workers</h3>
          <h1>45</h1>
        </div>

        <div style={cardStyle}>
          <h3>Total Attendance</h3>
          <h1>120</h1>
        </div>

        <div style={cardStyle}>
          <h3>Total Labour Cost</h3>
          <h1>₹ 80,000</h1>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
};

export default LabourReport;