import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleMaterial } from "../../api/materialApi";

function MaterialDetails() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMaterial = async () => {
      try {
        setLoading(true);
        const response = await getSingleMaterial(id);
        setMaterial(response.data.material);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Could not load material");
      } finally {
        setLoading(false);
      }
    };

    loadMaterial();
  }, [id]);

  return (
    <div style={cardStyle}>
      <h1 style={headingStyle}>Material Details</h1>

      {loading && <p>Loading...</p>}
      {!loading && error && <p style={errorStyle}>{error}</p>}

      {!loading && !error && material && (
        <div style={detailGridStyle}>
          <Detail label="Material" value={material.material_name} />
          <Detail label="Site" value={material.site_name || "-"} />
          <Detail label="Unit" value={material.unit} />
          <Detail label="Received" value={material.total_received || 0} />
          <Detail label="Used" value={material.total_used || 0} />
          <Detail label="Remaining" value={material.remaining_stock || 0} />
          <Detail label="Total Cost" value={`Rs. ${material.total_cost || 0}`} />
          <Detail
            label="Transport Charges"
            value={`Rs. ${material.transport_cost || 0}`}
          />
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

export default MaterialDetails;
