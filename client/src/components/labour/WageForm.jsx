import { useEffect, useState } from "react";
import { createWage, getLabours } from "../../api/labourApi";
import ErrorDialog from "../common/ErrorDialog";
import {
  validatePositiveNumber,
  validateRequired,
} from "../../utils/formValidation";

function WageForm() {
  const [labourId, setLabourId] = useState("");
  const [days, setDays] = useState("");
  const [rate, setRate] = useState("");
  const [labours, setLabours] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const total = Number(days || 0) * Number(rate || 0);
  const selectedLabour = labours.find(
    (labour) => String(labour.id) === labourId
  );

  const loadLabours = () => {
    getLabours()
      .then((response) => setLabours(response.data.labours || []))
      .catch(() => setLabours([]));
  };

  useEffect(() => {
    loadLabours();
    window.addEventListener("labours:changed", loadLabours);

    return () => {
      window.removeEventListener("labours:changed", loadLabours);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError =
      validateRequired([
        { label: "Labour", value: labourId },
        { label: "Total days", value: days },
        { label: "Rate per day", value: rate },
      ]) ||
      validatePositiveNumber(days, "Total days") ||
      validatePositiveNumber(rate, "Rate per day");

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      await createWage({
        labour_id: labourId || null,
        total_days: days,
        rate_per_day: rate,
        total_amount: total,
        wage_month: new Date().toISOString().slice(0, 7),
      });

      setLabourId("");
      setDays("");
      setRate("");
      window.dispatchEvent(new Event("labours:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate wage");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
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
        Generate Wage (Amount Earned)
      </h2>

      <p style={helperStyle}>
        This creates the labour's earned wage. It does not mark the labour as
        paid.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Labour</label>
          <select
            required
            value={labourId}
            onChange={(e) => {
              const nextLabourId = e.target.value;
              const labour = labours.find(
                (item) => String(item.id) === nextLabourId
              );

              setLabourId(nextLabourId);
              setRate(labour?.daily_wage || "");
            }}
            style={inputStyle}
          >
            <option value="">Select labour</option>
            {labours.map((labour) => (
              <option key={labour.id} value={labour.id}>
                {labour.labour_name} - Rs. {labour.daily_wage}/day
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Total Days</label>

          <input
            type="number"
            required
            min="0"
            step="0.5"
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
            required
            min="0"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder={
              selectedLabour
                ? `Default Rs. ${selectedLabour.daily_wage}/day`
                : "Enter rate"
            }
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
          Total Wage: Rs. {total}
        </div>

        <button type="submit" style={buttonStyle} disabled={saving}>
          {saving ? "Saving..." : "Generate Wage"}
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
  backgroundColor: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const helperStyle = {
  color: "#6b7280",
  fontWeight: "600",
  margin: "-8px 0 18px",
};

const errorStyle = {
  color: "#dc2626",
  marginBottom: "12px",
  fontWeight: "600",
};

export default WageForm;
