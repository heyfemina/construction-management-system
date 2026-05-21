import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleVendor } from "../../api/vendorApi";

function VendorDetails() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVendor = async () => {
      try {
        setLoading(true);
        const response = await getSingleVendor(id);
        setVendor(response.data.vendor);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Could not load vendor");
      } finally {
        setLoading(false);
      }
    };

    loadVendor();
  }, [id]);

  return (
    <div style={cardStyle}>
      <h1 style={headingStyle}>Vendor Details</h1>

      {loading && <p>Loading...</p>}
      {!loading && error && <p style={errorStyle}>{error}</p>}

      {!loading && !error && vendor && (
        <div style={detailGridStyle}>
          <Detail label="Vendor Name" value={vendor.vendor_name} />
          <Detail label="Contact" value={vendor.contact_number || "-"} />
          <Detail label="Email" value={vendor.email || "-"} />
          <Detail label="Address" value={vendor.address || "-"} />
          <Detail
            label="Total Purchase"
            value={`Rs. ${vendor.total_purchase || 0}`}
          />
          <Detail label="Paid Amount" value={`Rs. ${vendor.paid_amount || 0}`} />
          <Detail
            label="Pending Payment"
            value={`Rs. ${vendor.pending_amount || 0}`}
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

export default VendorDetails;
