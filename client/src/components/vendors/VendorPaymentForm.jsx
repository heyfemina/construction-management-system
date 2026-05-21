import { useEffect, useState } from "react";
import {
  createVendorPayment,
  getVendors,
} from "../../api/vendorApi";

function VendorPaymentForm() {
  const [vendorId, setVendorId] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [vendors, setVendors] = useState([]);
  const [saving, setSaving] = useState(false);

  const loadVendors = () => {
    getVendors()
      .then((response) => setVendors(response.data.vendors || []))
      .catch(() => setVendors([]));
  };

  useEffect(() => {
    loadVendors();
    window.addEventListener("vendors:changed", loadVendors);

    return () => {
      window.removeEventListener("vendors:changed", loadVendors);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await createVendorPayment({
        vendor_id: vendorId || null,
        total_amount: amount,
        paid_amount: amount,
        pending_amount: 0,
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: method,
        recipient_email: recipientEmail,
      });

      setVendorId("");
      setRecipientEmail("");
      setAmount("");
      setMethod("");
      window.dispatchEvent(new Event("vendors:changed"));
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
        Vendor Payment
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Vendor</label>
          <select
            required
            value={vendorId}
            onChange={(e) => {
              const nextVendorId = e.target.value;
              const vendor = vendors.find(
                (item) => String(item.id) === nextVendorId
              );

              setVendorId(nextVendorId);
              setRecipientEmail(vendor?.email || "");
            }}
            style={inputStyle}
          >
            <option value="">Select vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.vendor_name} - Pending Rs. {vendor.pending_amount || 0}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Vendor Email</label>
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

export default VendorPaymentForm;
