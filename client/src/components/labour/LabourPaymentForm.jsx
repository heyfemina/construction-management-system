import { useEffect, useState } from "react";
import {
  createLabourPayment,
  getLabours,
} from "../../api/labourApi";

function LabourPaymentForm() {
  const [labourId, setLabourId] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [labours, setLabours] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    setSaving(true);
    setError("");

    try {
      await createLabourPayment({
        labour_id: labourId || null,
        total_amount: amount,
        paid_amount: amount,
        pending_amount: 0,
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: method,
        recipient_email: recipientEmail,
      });

      setLabourId("");
      setRecipientEmail("");
      setAmount("");
      setMethod("");
      window.dispatchEvent(new Event("labours:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not save labour payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>Labour Payment</h2>

      <form onSubmit={handleSubmit}>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Labour</label>
          <select
            required
            value={labourId}
            onChange={(e) => setLabourId(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select labour</option>
            {labours.map((labour) => (
              <option key={labour.id} value={labour.id}>
                {labour.labour_name} - Pending Rs. {labour.pending_amount || 0}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Labour Email</label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="Optional email receipt"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Payment Amount</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter payment amount"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Payment Method</label>
          <input
            type="text"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            placeholder="Cash / UPI / Bank"
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle} disabled={saving}>
          {saving ? "Saving..." : "Save Payment"}
        </button>
      </form>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "12px",
  marginTop: "20px",
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
  width: "100%",
  padding: "12px",
  backgroundColor: "#059669",
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

export default LabourPaymentForm;
