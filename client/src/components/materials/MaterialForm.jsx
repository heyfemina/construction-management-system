import { useState } from "react";
import { addMaterial } from "../../services/materialService";

function MaterialForm() {
  const [materialName, setMaterialName] = useState("");
  const [unit, setUnit] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addMaterial({
        site_id: null,
        material_name: materialName,
        unit,
      });

      setMaterialName("");
      setUnit("");
      window.dispatchEvent(new Event("materials:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not save material");
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
        Add Material
      </h2>

      <form onSubmit={handleSubmit}>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Material Name</label>

          <input
            type="text"
            required
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            placeholder="Enter material name"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Unit</label>

          <input
            type="text"
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Bag / Kg / Ton / Piece"
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Saving..." : "Save Material"}
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

export default MaterialForm;
