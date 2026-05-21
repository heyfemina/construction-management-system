import { useEffect, useState } from "react";
import { addPayment, getFinanceData } from "../../services/financeService";

function PaymentForm() {
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadClients = () => {
    getFinanceData()
      .then((data) => setClients(data.clients || []))
      .catch(() => setClients([]));
  };

  useEffect(() => {
    loadClients();
    window.addEventListener("finance:changed", loadClients);

    return () => {
      window.removeEventListener("finance:changed", loadClients);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addPayment({
        client_id: clientId || null,
        payment_amount: amount,
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: method,
        notes: "",
      });

      setClientId("");
      setAmount("");
      setMethod("");
      window.dispatchEvent(new Event("finance:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not save payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>Add Payment</h2>

      <form onSubmit={handleSubmit}>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Client / Party</label>
          <select
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select client or party</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.client_name} - Pending Rs. {client.pending_amount || 0}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Amount</label>
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

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Saving..." : "Save Payment"}
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
  border: "1px solid #d1d5db",
  borderRadius: "8px",
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

export default PaymentForm;
