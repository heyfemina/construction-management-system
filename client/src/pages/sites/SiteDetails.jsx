import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleSite } from "../../api/siteApi";

function SiteDetails() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSite = async () => {
      try {
        setLoading(true);
        const response = await getSingleSite(id);
        setSite(response.data.site);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Could not load site");
      } finally {
        setLoading(false);
      }
    };

    loadSite();
  }, [id]);

  return (
    <div style={cardStyle}>
      <h1 style={headingStyle}>Site Details</h1>

      {loading && <p>Loading...</p>}
      {!loading && error && <p style={errorStyle}>{error}</p>}

      {!loading && !error && site && (
        <div style={detailGridStyle}>
          <Detail label="Site Name" value={site.site_name} />
          <Detail label="Location" value={site.location || "-"} />
          <Detail label="Description" value={site.description || "-"} />
          <Detail label="Total Expense" value={`Rs. ${site.total_expense || 0}`} />
          <Detail
            label="Material Cost"
            value={`Rs. ${site.material_cost || 0}`}
          />
          <Detail label="Labour Cost" value={`Rs. ${site.labour_cost || 0}`} />
          <Detail label="Labour Count" value={site.labour_count || 0} />
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <p style={detailStyle}>
      <strong>{label}:</strong> {value}
    </p>
  );
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "12px",
};

const headingStyle = {
  fontSize: "32px",
  fontWeight: "700",
  marginBottom: "20px",
};

const detailGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
  fontSize: "18px",
};

const detailStyle = {
  margin: 0,
  lineHeight: "1.7",
};

const errorStyle = {
  color: "#dc2626",
  fontWeight: "600",
};

export default SiteDetails;
