import { useEffect, useState } from "react";
import { addReceivable } from "../../services/financeService";
import { getSites } from "../../api/siteApi";
import ErrorDialog from "../common/ErrorDialog";
import {
  validateNonNegativeNumber,
  validatePositiveNumber,
  validateRequired,
} from "../../utils/formValidation";

function ClientForm() {
  const [clientName, setClientName] = useState("");
  const [siteId, setSiteId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [sites, setSites] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pendingAmount =
    Number(totalAmount || 0) - Number(receivedAmount || 0);

  useEffect(() => {
    getSites()
      .then((response) => setSites(response.data.sites || []))
      .catch(() => setSites([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError =
      validateRequired([
        { label: "Client name", value: clientName },
        { label: "Site", value: siteId },
        { label: "Total amount", value: totalAmount },
        { label: "Received amount", value: receivedAmount },
        { label: "Due date", value: dueDate },
      ]) ||
      validatePositiveNumber(totalAmount, "Total amount") ||
      validateNonNegativeNumber(receivedAmount, "Received amount");

    if (validationError) {
      setError(validationError);
      return;
    }

    if (pendingAmount < 0) {
      setError("Received amount cannot be greater than total amount");
      return;
    }

    setLoading(true);

    try {
      await addReceivable({
        client_name: clientName,
        site_id: siteId || null,
        total_amount: totalAmount,
        received_amount: receivedAmount || 0,
        pending_amount: pendingAmount,
        due_date: dueDate || null,
      });

      setClientName("");
      setSiteId("");
      setTotalAmount("");
      setReceivedAmount("");
      setDueDate("");
      window.dispatchEvent(new Event("finance:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not save receivable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div style={cardStyle}>
      <h2 style={headingStyle}>Add Receivable</h2>

      <form onSubmit={handleSubmit} noValidate>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Client / Party Name</label>
          <input
            type="text"
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter client or party name"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Site</label>
          <select
            required
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            style={inputStyle}
          >
            <option value="">No site selected</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.site_name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Total Amount</label>
          <input
            type="number"
            required
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="Enter total amount"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Received Amount</label>
          <input
            type="number"
            required
            value={receivedAmount}
            onChange={(e) => setReceivedAmount(e.target.value)}
            placeholder="Enter received amount"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Due Date</label>
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <p style={{ fontWeight: "700" }}>
          Pending Amount: Rs. {pendingAmount}
        </p>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Saving..." : "Save Receivable"}
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

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
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
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "12px",
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

export default ClientForm;
