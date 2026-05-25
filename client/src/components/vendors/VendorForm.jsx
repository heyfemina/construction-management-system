import { useEffect, useState } from "react";
import { getSites } from "../../api/siteApi";
import { addVendor, updateVendor } from "../../services/vendorService";
import ErrorDialog from "../common/ErrorDialog";
import FieldError from "../common/FieldError";
import {
  validateEmail,
  validatePhone,
} from "../../utils/formValidation";

function VendorForm() {
  const [editingId, setEditingId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [siteId, setSiteId] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [sites, setSites] = useState([]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const showError = (message) => setError(message);

  useEffect(() => {
    const loadSites = () => {
      getSites()
        .then((response) => setSites(response.data.sites || []))
        .catch(() => setSites([]));
    };

    const handleEdit = (event) => {
      const vendor = event.detail;

      setEditingId(vendor.id);
      setVendorName(vendor.vendor_name || "");
      setSiteId(vendor.site_id || "");
      setContact(vendor.contact_number || "");
      setEmail(vendor.email || "");
      setAddress(vendor.address || "");
      setError("");
      setFieldErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    loadSites();
    window.addEventListener("vendors:edit", handleEdit);
    window.addEventListener("sites:changed", loadSites);

    return () => {
      window.removeEventListener("vendors:edit", handleEdit);
      window.removeEventListener("sites:changed", loadSites);
    };
  }, []);

  const resetForm = () => {
    setEditingId("");
    setVendorName("");
    setSiteId("");
    setContact("");
    setEmail("");
    setAddress("");
    setFieldErrors({});
  };

  const clearFieldError = (field) => {
    setFieldErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nextFieldErrors = {
      vendorName: vendorName.trim() ? "" : "Vendor name is required",
      contact: contact.trim()
        ? validatePhone(contact)
        : "Contact number is required",
      email: email.trim() ? validateEmail(email) : "Email is required",
      siteId: siteId ? "" : "Site is required",
      address: address.trim() ? "" : "Address is required",
    };

    setFieldErrors(nextFieldErrors);

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        vendor_name: vendorName,
        site_id: siteId || null,
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
      showError(err.response?.data?.message || "Could not save vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      <form onSubmit={handleSubmit} noValidate>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Vendor Name</label>

          <input
            type="text"
            required
            value={vendorName}
            onChange={(e) => {
              setVendorName(e.target.value);
              clearFieldError("vendorName");
            }}
            placeholder="Enter vendor name"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Contact Number</label>

          <input
            type="text"
            required
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              clearFieldError("contact");
            }}
            placeholder="Enter contact number"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            placeholder="Enter email"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.email} />
          <FieldError message={fieldErrors.contact} />
          <FieldError message={fieldErrors.vendorName} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Site</label>

          <select
            required
            value={siteId}
            onChange={(e) => {
              setSiteId(e.target.value);
              clearFieldError("siteId");
            }}
            style={inputStyle}
          >
            <option value="">No site selected</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.site_name}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.siteId} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Address</label>

          <input
            type="text"
            required
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              clearFieldError("address");
            }}
            placeholder="Enter address"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.address} />
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
    <ErrorDialog
      isOpen={Boolean(error)}
      message={error}
      onClose={() => setError("")}
    />
    </>
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
