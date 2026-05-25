import { useEffect, useState } from "react";
import { addSite, updateSite } from "../../services/siteService";
import ErrorDialog from "../common/ErrorDialog";
import FieldError from "../common/FieldError";

function SiteForm() {
  const [editingId, setEditingId] = useState("");
  const [siteName, setSiteName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEdit = (event) => {
      const site = event.detail;

      setEditingId(site.id);
      setSiteName(site.site_name || "");
      setLocation(site.location || "");
      setDescription(site.description || "");
      setError("");
      setFieldErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("sites:edit", handleEdit);

    return () => {
      window.removeEventListener("sites:edit", handleEdit);
    };
  }, []);

  const resetForm = () => {
    setEditingId("");
    setSiteName("");
    setLocation("");
    setDescription("");
    setFieldErrors({});
  };

  const clearFieldError = (field) => {
    setFieldErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nextFieldErrors = {
      siteName: siteName.trim() ? "" : "Site name is required",
      location: location.trim() ? "" : "Location is required",
      description: description.trim() ? "" : "Description is required",
    };

    setFieldErrors(nextFieldErrors);

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        site_name: siteName,
        location,
        description,
      };

      if (editingId) {
        await updateSite(editingId, payload);
      } else {
        await addSite(payload);
      }

      resetForm();
      window.dispatchEvent(new Event("sites:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not save site");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div style={cardStyle}>
      <h2 style={headingStyle}>{editingId ? "Edit Site" : "Add Site"}</h2>

      <form onSubmit={handleSubmit} noValidate>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Site Name</label>
          <input
            type="text"
            required
            value={siteName}
            onChange={(e) => {
              setSiteName(e.target.value);
              clearFieldError("siteName");
            }}
            placeholder="Enter site name"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.siteName} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Location</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              clearFieldError("location");
            }}
            placeholder="Enter location"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.location} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearFieldError("description");
            }}
            placeholder="Enter site description"
            rows="4"
            style={{ ...inputStyle, resize: "none" }}
          />
          <FieldError message={fieldErrors.description} />
        </div>

        <div style={buttonRowStyle}>
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Saving..." : editingId ? "Update Site" : "Save Site"}
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

export default SiteForm;
