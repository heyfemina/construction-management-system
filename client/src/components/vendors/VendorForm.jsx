import { useEffect, useState } from "react";
import { addVendor, updateVendor } from "../../services/vendorService";

function VendorForm() {
  const [editingId, setEditingId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEdit = (event) => {
      const vendor = event.detail;

      setEditingId(vendor.id);
      setVendorName(vendor.vendor_name || "");
      setContact(vendor.contact_number || "");
      setEmail(vendor.email || "");
      setAddress(vendor.address || "");
      setError("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("vendors:edit", handleEdit);

    return () => {
      window.removeEventListener("vendors:edit", handleEdit);
    };
  }, []);

  const resetForm = () => {
    setEditingId("");
    setVendorName("");
    setContact("");
    setEmail("");
    setAddress("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        vendor_name: vendorName,
        contact_number: contact,
        email,
        address,
      };

      if (editingId) {
        await updateVendor(editingId, payload);
      } else {
        await addVendor(payload);
      }

      resetForm();
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
        {editingId ? "Edit Vendor" : "Add Vendor"}
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

        <div style={buttonRowStyle}>
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Saving..." : editingId ? "Update Vendor" : "Save Vendor"}
          </button>

          {editingId && (
            <button
              type="button"
              style={secondaryButtonStyle}
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
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
  padding: "12px",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#6b7280",
};

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const errorStyle = {
  color: "#dc2626",
  marginBottom: "12px",
  fontWeight: "600",
};

export default VendorForm;
