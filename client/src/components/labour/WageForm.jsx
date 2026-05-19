import { useState } from "react";
import { createWage } from "../../api/labourApi";

function WageForm() {
  const [days, setDays] = useState("");
  const [rate, setRate] = useState("");
  const [saving, setSaving] = useState(false);

  const total = days * rate || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await createWage({
        total_days: days,
        rate_per_day: rate,
        total_amount: total,
        wage_month: new Date().toISOString().slice(0, 7),
      });

      setDays("");
      setRate("");
      window.dispatchEvent(new Event("labours:changed"));
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
        Wage Management
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Total Days</label>

          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="Enter total days"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Rate Per Day</label>

          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Enter rate"
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
          Total Wage: ₹ {total}
        </div>

        <button type="submit" style={buttonStyle} disabled={saving}>
          {saving ? "Saving..." : "Save Wage"}
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

export default WageForm;
