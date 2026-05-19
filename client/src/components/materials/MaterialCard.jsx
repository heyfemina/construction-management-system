function MaterialCard({
  materialName,
  quantity,
  remaining,
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "700",
          marginBottom: "15px",
        }}
      >
        {materialName}
      </h2>

      <p
        style={{
          marginBottom: "10px",
          fontSize: "18px",
        }}
      >
        Total Quantity: {quantity}
      </p>

      <p
        style={{
          fontSize: "18px",
          color: "#059669",
          fontWeight: "600",
        }}
      >
        Remaining Stock: {remaining}
      </p>
    </div>
  );
}

export default MaterialCard;