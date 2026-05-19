function VendorReport() {
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
        Vendor Report
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Vendors</h3>
          <h1>15</h1>
        </div>

        <div style={cardStyle}>
          <h3>Total Purchases</h3>
          <h1>₹ 2,50,000</h1>
        </div>

        <div style={cardStyle}>
          <h3>Pending Payments</h3>
          <h1>₹ 70,000</h1>
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

export default VendorReport;