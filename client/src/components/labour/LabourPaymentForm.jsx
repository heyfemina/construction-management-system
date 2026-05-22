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
  const selectedLabour = labours.find(
    (labour) => String(labour.id) === String(labourId)
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

    if (!labourId || Number(amount) <= 0) {
      setError("Select labour and enter payment amount.");
      return;
    }

    if (Number(amount) > Number(selectedLabour?.pending_amount || 0)) {
      setError("Payment amount cannot be more than pending wage.");
      return;
    }

    setSaving(true);

    try {
      await createLabourPayment({
        labour_id: labourId || null,
        total_amount: selectedLabour?.total_wage || amount,
        paid_amount: amount,
        pending_amount:
          Number(selectedLabour?.pending_amount || 0) - Number(amount || 0),
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
      <h2 style={headingStyle}>Record Labour Payment (Amount Paid)</h2>

      <p style={helperStyle}>
        This records actual money paid to labour and reduces pending wage
        balance.
      </p>

      <form onSubmit={handleSubmit}>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Labour</label>
          <select
            required
            value={labourId}
            onChange={(e) => {
              const nextLabourId = e.target.value;
              const labour = labours.find(
                (item) => String(item.id) === String(nextLabourId)
              );

              setLabourId(nextLabourId);
              setRecipientEmail(labour?.email || "");
            }}
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

        {selectedLabour && (
          <p style={balanceStyle}>
            Total wage: Rs. {selectedLabour.total_wage || 0} | Paid: Rs.{" "}
            {selectedLabour.paid_amount || 0} | Pending wage: Rs.{" "}
            {selectedLabour.pending_amount || 0}
          </p>
        )}

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
          <label>Paid Amount</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter paid amount"
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
          {saving ? "Saving..." : "Record Payment"}
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

const helperStyle = {
  color: "#6b7280",
  fontWeight: "600",
  margin: "-8px 0 18px",
};

const balanceStyle = {
  margin: "-6px 0 15px",
  color: "#6b7280",
  fontWeight: "600",
};

export default LabourPaymentForm;
