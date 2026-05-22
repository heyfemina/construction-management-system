import { Link } from "react-router-dom";

function SiteCard({
  id,
  siteName,
  location,
  totalExpense,
  materialCount = 0,
  labourCount = 0,
  vendorCount = 0,
  expenseCount = 0,
}) {
  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>{siteName}</h2>

      <p style={locationStyle}>Location: {location}</p>

      <div style={statsGridStyle}>
        <Stat label="Materials" value={materialCount} />
        <Stat label="Labour" value={labourCount} />
        <Stat label="Vendors" value={vendorCount} />
        <Stat label="Expenses" value={expenseCount} />
      </div>

      <p style={expenseStyle}>Total Expense: Rs. {totalExpense || 0}</p>

      <Link to={`/sites/details/${id}`} style={reportLinkStyle}>
        View Site Report
      </Link>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={statStyle}>
      <strong>{value || 0}</strong>
      <span>{label}</span>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "15px",
};

const locationStyle = {
  marginBottom: "10px",
  fontSize: "18px",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "10px",
  margin: "15px 0",
};

const statStyle = {
  display: "grid",
  gap: "3px",
  padding: "10px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "#f9fafb",
};

const expenseStyle = {
  fontSize: "18px",
  color: "#dc2626",
  fontWeight: "600",
  marginBottom: "14px",
};

const reportLinkStyle = {
  display: "inline-flex",
  color: "#2563eb",
  fontWeight: "700",
  textDecoration: "none",
};

export default SiteCard;
