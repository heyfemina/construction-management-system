import { useState } from "react";
import { addLabour } from "../../services/labourService";

function LabourForm() {
  const [labourName, setLabourName] = useState("");
  const [contact, setContact] = useState("");
  const [dailyWage, setDailyWage] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addLabour({
        site_id: null,
        labour_name: labourName,
        contact_number: contact,
        address,
        daily_wage: dailyWage,
      });

      setLabourName("");
      setContact("");
      setDailyWage("");
      setAddress("");
      window.dispatchEvent(new Event("labours:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not save labour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>Add Labour</h2>

      <form onSubmit={handleSubmit}>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Labour Name</label>
          <input
            type="text"
            required
            value={labourName}
            onChange={(e) => setLabourName(e.target.value)}
            placeholder="Enter labour name"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Contact Number</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Enter contact number"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Daily Wage</label>
          <input
            type="number"
            required
            value={dailyWage}
            onChange={(e) => setDailyWage(e.target.value)}
            placeholder="Enter daily wage"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Saving..." : "Save Labour"}
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

export default LabourForm;
