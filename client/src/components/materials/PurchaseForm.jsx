import { useState } from "react";
import { createMaterialPurchase } from "../../api/materialApi";

function PurchaseForm() {
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [transportCost, setTransportCost] = useState("");
  const [saving, setSaving] = useState(false);

  const total =
    Number(quantity) * Number(unitCost) +
    Number(transportCost || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await createMaterialPurchase({
        quantity,
        unit_cost: unitCost,
        transport_cost: transportCost || 0,
        total_cost: total,
        purchase_date: new Date().toISOString().slice(0, 10),
      });

      setQuantity("");
      setUnitCost("");
      setTransportCost("");
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
        Material Purchase
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Quantity</label>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Unit Cost</label>

          <input
            type="number"
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
            placeholder="Enter unit cost"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Transport Cost</label>

          <input
            type="number"
            value={transportCost}
            onChange={(e) => setTransportCost(e.target.value)}
            placeholder="Enter transport cost"
            style={inputStyle}
          />
        </div>

        <div
          style={{
            marginBottom: "20px",
            fontSize: "20px",
            fontWeight: "700",
          }}
        >
          Total Cost: ₹ {total}
        </div>

        <button type="submit" style={buttonStyle} disabled={saving}>
          {saving ? "Saving..." : "Save Purchase"}
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
  backgroundColor: "#059669",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default PurchaseForm;
