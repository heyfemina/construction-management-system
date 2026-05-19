function FinanceReport() {
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
        Finance Summary Report
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Expenses</h3>
          <h1>₹ 1,20,000</h1>
        </div>

        <div style={cardStyle}>
          <h3>Total Received</h3>
          <h1>₹ 80,000</h1>
        </div>

        <div style={cardStyle}>
          <h3>Pending Amount</h3>
          <h1>₹ 40,000</h1>
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

export default FinanceReport;