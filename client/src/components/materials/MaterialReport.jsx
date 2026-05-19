function MaterialReport() {
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
        Material Report
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Materials</h3>
          <h1>12</h1>
        </div>

        <div style={cardStyle}>
          <h3>Total Stock</h3>
          <h1>850</h1>
        </div>

        <div style={cardStyle}>
          <h3>Total Material Cost</h3>
          <h1>₹ 1,20,000</h1>
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

export default MaterialReport;