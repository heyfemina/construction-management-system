function SummaryCards({
  title,
  value,
  color = "#2563eb",
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderLeft: `6px solid ${color}`,
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          color: "#6b7280",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          fontSize: "28px",
          fontWeight: "700",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default SummaryCards;