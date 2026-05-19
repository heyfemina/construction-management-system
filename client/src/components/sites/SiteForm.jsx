import { useState } from "react";
import { addSite } from "../../services/siteService";

function SiteForm() {
  const [siteName, setSiteName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addSite({
        site_name: siteName,
        location,
        description,
      });

      setSiteName("");
      setLocation("");
      setDescription("");
      window.dispatchEvent(new Event("sites:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not save site");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>Add Site</h2>

      <form onSubmit={handleSubmit}>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Site Name</label>
          <input
            type="text"
            required
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Enter site name"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Location</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter site description"
            rows="4"
            style={{ ...inputStyle, resize: "none" }}
          />
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Saving..." : "Save Site"}
        </button>
      </form>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "5px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const errorStyle = {
  color: "#dc2626",
  marginBottom: "12px",
  fontWeight: "600",
};

export default SiteForm;
