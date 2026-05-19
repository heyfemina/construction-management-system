import { useState } from "react";
import { createMaterialUsage } from "../../api/materialApi";

function UsageForm() {
  const [usedQuantity, setUsedQuantity] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await createMaterialUsage({
        used_quantity: usedQuantity,
        usage_date: new Date().toISOString().slice(0, 10),
      });

      setUsedQuantity("");
      window.dispatchEvent(new Event("materials:changed"));
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
        <div style={{ marginBottom: "15px" }}>
          <label>Used Quantity</label>

          <input
            type="number"
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

export default UsageForm;
