function DashboardCards({
  title,
  amount,
  bgColor = "#ffffff",
  textColor = "#000000",
}) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        width: "100%",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          marginBottom: "10px",
          fontWeight: "600",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          fontSize: "30px",
          fontWeight: "700",
        }}
      >
        {amount}
      </h1>
    </div>
  );
}

export default DashboardCards;
