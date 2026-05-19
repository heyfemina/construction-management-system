function SiteCard({
  siteName,
  location,
  totalExpense,
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
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "15px",
        }}
      >
        {siteName}
      </h2>

      <p
        style={{
          marginBottom: "10px",
          fontSize: "18px",
        }}
      >
        Location: {location}
      </p>

      <p
        style={{
          fontSize: "18px",
          color: "#dc2626",
          fontWeight: "600",
        }}
      >
        Total Expense: ₹ {totalExpense}
      </p>
    </div>
  );
}

export default SiteCard;