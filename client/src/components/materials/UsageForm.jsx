import { useEffect, useState } from "react";
import {
  createMaterialUsage,
  getMaterials,
} from "../../api/materialApi";
import { getSites } from "../../api/siteApi";

function UsageForm() {
  const [materialId, setMaterialId] = useState("");
  const [siteId, setSiteId] = useState("");
  const [usedQuantity, setUsedQuantity] = useState("");
  const [materials, setMaterials] = useState([]);
  const [sites, setSites] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadOptions = () => {
    Promise.all([getMaterials(), getSites()])
      .then(([materialsResponse, sitesResponse]) => {
        setMaterials(materialsResponse.data.materials || []);
        setSites(sitesResponse.data.sites || []);
      })
      .catch(() => {
        setMaterials([]);
        setSites([]);
      });
  };

  useEffect(() => {
    loadOptions();
    window.addEventListener("materials:changed", loadOptions);
    window.addEventListener("sites:changed", loadOptions);

    return () => {
      window.removeEventListener("materials:changed", loadOptions);
      window.removeEventListener("sites:changed", loadOptions);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!materialId || Number(usedQuantity) <= 0) {
      setError("Select material and enter used quantity.");
      return;
    }

    setSaving(true);

    try {
      await createMaterialUsage({
        material_id: materialId || null,
        site_id: siteId || null,
        used_quantity: usedQuantity,
        usage_date: new Date().toISOString().slice(0, 10),
      });

      setMaterialId("");
      setSiteId("");
      setUsedQuantity("");
      window.dispatchEvent(new Event("materials:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not save usage");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Material Usage
      </h2>

      <form onSubmit={handleSubmit}>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Material</label>
          <select
            required
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select material</option>
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.material_name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Site</label>
          <select
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select site</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.site_name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Used Quantity</label>

          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={usedQuantity}
            onChange={(e) => setUsedQuantity(e.target.value)}
            placeholder="Enter used quantity"
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle} disabled={saving}>
          {saving ? "Saving..." : "Save Usage"}
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
  backgroundColor: "#dc2626",
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

export default UsageForm;
