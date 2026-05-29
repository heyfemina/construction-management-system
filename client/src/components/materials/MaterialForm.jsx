import { useEffect, useState } from "react";
import { addMaterial, updateMaterial } from "../../services/materialService";
import { getSites } from "../../api/siteApi";
import ErrorDialog from "../common/ErrorDialog";
import FieldError from "../common/FieldError";
import isConnectionError from "../../utils/isConnectionError";

function MaterialForm({ material = null, onSaved }) {
  const isEdit = Boolean(material?.id);
  const [materialName, setMaterialName] = useState(material?.material_name || "");
  const [unit, setUnit] = useState(material?.unit || "");
  const [siteId, setSiteId] = useState(material?.site_id ? String(material.site_id) : "");
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

  useEffect(() => {
    setMaterialName(material?.material_name || "");
    setUnit(material?.unit || "");
    setSiteId(material?.site_id ? String(material.site_id) : "");
    setFieldErrors({});
  }, [material]);

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
      const payload = {
        site_id: siteId || null,
        material_name: materialName,
        unit,
      };

      if (isEdit) {
        await updateMaterial(material.id, payload);
      } else {
        await addMaterial(payload);
      }

      if (!isEdit) {
        setMaterialName("");
        setUnit("");
        setSiteId("");
      }
      setFieldErrors({});
      window.dispatchEvent(new Event("materials:changed"));
      onSaved?.();
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
    <div className="material-entry-card">
      <div className="material-entry-header">
        <div>
          <p>Material</p>
          <h2>{isEdit ? "Edit Material" : "Add Material"}</h2>
        </div>
      </div>

      <form className="material-entry-form" onSubmit={handleSubmit} noValidate>
        {error && <p style={errorStyle}>{error}</p>}

        <div className="material-field">
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
          />
          <FieldError message={fieldErrors.materialName} />
        </div>

        <div className="material-field">
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
          />
          <FieldError message={fieldErrors.unit} />
        </div>

        <div className="material-field">
          <label>Site</label>

          <select
            required
            value={siteId}
            onChange={(e) => {
              setSiteId(e.target.value);
              setFieldErrors((current) => ({ ...current, siteId: "" }));
            }}
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

        <button type="submit" className="material-form-button" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Material" : "Save Material"}
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

const errorStyle = {
  color: "#dc2626",
  margin: "0",
  fontWeight: "600",
};

export default MaterialForm;
