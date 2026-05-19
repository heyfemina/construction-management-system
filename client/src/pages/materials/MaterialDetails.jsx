function MaterialDetails() {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Material Details
      </h1>

      <div
        style={{
          lineHeight: "2",
          fontSize: "18px",
        }}
      >
        <p>
          <strong>Material:</strong> Cement
        </p>

        <p>
          <strong>Quantity:</strong> 200 Bags
        </p>

        <p>
          <strong>Cost:</strong> ₹ 80,000
        </p>

        <p>
          <strong>Stock Remaining:</strong> 120 Bags
        </p>
      </div>
    </div>
  );
}

export default MaterialDetails;