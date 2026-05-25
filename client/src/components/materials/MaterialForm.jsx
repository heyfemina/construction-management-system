import { useEffect, useState } from "react";
import { addMaterial } from "../../services/materialService";
import { getSites } from "../../api/siteApi";
import ErrorDialog from "../common/ErrorDialog";
import FieldError from "../common/FieldError";
import isConnectionError from "../../utils/isConnectionError";

function MaterialForm() {
  const [materialName, setMaterialName] = useState("");
  const [unit, setUnit] = useState("");
  const [siteId, setSiteId] = useState("");
  const [sites, setSites] = useState([]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const loadSites = () => {
    getSites()
      .then((response) => setSites(response.data.sites || []))
      .catch(() => setSites([]));
  };

  useEffect(() => {
    loadSites();
    window.addEventListener("sites:changed", loadSites);

    return () => {
      window.removeEventListener("sites:changed", loadSites);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nextFieldErrors = {
      materialName: materialName.trim() ? "" : "Material name is required",
      unit: unit.trim() ? "" : "Unit is required",
      siteId: siteId ? "" : "Site is required",
    };

    setFieldErrors(nextFieldErrors);

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return;
    }

    setLoading(true);

    try {
      await addMaterial({
        site_id: siteId || null,
        material_name: materialName,
        unit,
      });

      setMaterialName("");
      setUnit("");
      setSiteId("");
      setFieldErrors({});
      window.dispatchEvent(new Event("materials:changed"));
    } catch (err) {
      if (isConnectionError(err)) {
        setError("");
        return;
      }

      setError(err.response?.data?.message || "Could not save material");
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
        Add Material
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Material Name</label>

          <input
            type="text"
            required
            value={materialName}
            onChange={(e) => {
              setMaterialName(e.target.value);
              setError("");
              setFieldErrors((current) => ({ ...current, materialName: "" }));
            }}
            placeholder="Enter material name"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.materialName} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Unit</label>

          <input
            type="text"
            required
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value);
              setError("");
              setFieldErrors((current) => ({ ...current, unit: "" }));
            }}
            placeholder="Bag / Kg / Ton / Piece"
            style={inputStyle}
          />
          <FieldError message={fieldErrors.unit} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Site</label>

          <select
            required
            value={siteId}
            onChange={(e) => {
              setSiteId(e.target.value);
              setFieldErrors((current) => ({ ...current, siteId: "" }));
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

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Saving..." : "Save Material"}
        </button>
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

export default MaterialForm;
