import { useEffect, useState } from "react";
import {
  createVendorPayment,
  getVendors,
} from "../../api/vendorApi";
import ErrorDialog from "../common/ErrorDialog";
import {
  validatePositiveNumber,
  validateRequired,
} from "../../utils/formValidation";

function VendorPaymentForm() {
  const [vendorId, setVendorId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [vendors, setVendors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const selectedVendor = vendors.find(
    (vendor) => String(vendor.id) === String(vendorId)
  );

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
    setError("");

    const validationError =
      validateRequired([
        { label: "Vendor", value: vendorId },
        { label: "Payment amount", value: amount },
        { label: "Payment method", value: method },
      ]) || validatePositiveNumber(amount, "Payment amount");

    if (validationError) {
      setError(validationError);
      return;
    }

    if (Number(amount) > Number(selectedVendor?.pending_amount || 0)) {
      setError("Payment amount cannot be more than pending amount.");
      return;
    }

    setSaving(true);

    try {
      await createVendorPayment({
        vendor_id: vendorId || null,
        total_amount: amount,
        paid_amount: amount,
        pending_amount: 0,
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: method,
      });

      setVendorId("");
      setAmount("");
      setMethod("");
      window.dispatchEvent(new Event("vendors:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not save vendor payment");
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
        Vendor Payment
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>Vendor</label>
          <select
            required
            value={vendorId}
            onChange={(e) => {
              setVendorId(e.target.value);
              setError("");
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

        {selectedVendor && (
          <p style={hintStyle}>
            Total purchase: Rs. {selectedVendor.total_purchase || 0} | Paid: Rs.{" "}
            {selectedVendor.paid_amount || 0} | Pending: Rs.{" "}
            {selectedVendor.pending_amount || 0}
          </p>
        )}

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
            required
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
  backgroundColor: "#059669",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const hintStyle = {
  margin: "-6px 0 15px",
  color: "#6b7280",
  fontWeight: "600",
};

const errorStyle = {
  color: "#dc2626",
  marginBottom: "12px",
  fontWeight: "600",
};

export default VendorPaymentForm;
