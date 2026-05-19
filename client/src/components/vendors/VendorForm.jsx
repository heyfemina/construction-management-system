import { useState } from "react";
import { addVendor } from "../../services/vendorService";

function VendorForm() {
  const [vendorName, setVendorName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addVendor({
        vendor_name: vendorName,
        contact_number: contact,
        email,
        address,
      });

      setVendorName("");
      setContact("");
      setEmail("");
      setAddress("");
      window.dispatchEvent(new Event("vendors:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not save vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Add Vendor
      </h2>

      <form onSubmit={handleSubmit}>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Vendor Name</label>

          <input
            type="text"
            required
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="Enter vendor name"
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
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
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
          {loading ? "Saving..." : "Save Vendor"}
        </button>
      </form>
    </div>
  );
}

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

export default VendorForm;
