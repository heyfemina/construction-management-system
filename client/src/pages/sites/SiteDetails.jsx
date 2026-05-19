function SiteDetails() {
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
        Site Details
      </h1>

      <div
        style={{
          lineHeight: "2",
          fontSize: "18px",
        }}
      >
        <p>
          <strong>Site Name:</strong> Site A
        </p>

        <p>
          <strong>Location:</strong> Mumbai
        </p>

        <p>
          <strong>Description:</strong> Residential Construction Project
        </p>

        <p>
          <strong>Total Expense:</strong> ₹ 2,50,000
        </p>

        <p>
          <strong>Total Labour Cost:</strong> ₹ 80,000
        </p>

        <p>
          <strong>Total Material Cost:</strong> ₹ 1,20,000
        </p>
      </div>
    </div>
  );
}

export default SiteDetails;