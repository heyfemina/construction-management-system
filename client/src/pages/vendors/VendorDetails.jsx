import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getVendorLedger,
  updateVendor,
} from "../../api/vendorApi";
import ExcelExport from "../../components/reports/ExcelExport";
import PDFExport from "../../components/reports/PDFExport";
import ReportTable from "../../components/reports/ReportTable";
import generateVendorReportPDF from "../../utils/generateVendorReportPDF";

function VendorDetails() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    vendor_name: "",
    contact_number: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadVendor = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getVendorLedger(id);
      const nextVendor = response.data.vendor;

      setVendor(nextVendor);
      setTransactions(response.data.transactions || []);
      setForm({
        vendor_name: nextVendor.vendor_name || "",
        contact_number: nextVendor.contact_number || "",
        email: nextVendor.email || "",
        address: nextVendor.address || "",
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load vendor");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVendor();
  }, [loadVendor]);

  const rows = transactions.map((item) => ({
    date: item.transaction_date
      ? new Date(item.transaction_date).toLocaleDateString()
      : "-",
    type: item.type,
    material_name: item.material_name || "-",
    site_name: item.site_name || "-",
    quantity: item.quantity || "-",
    unit_cost: item.unit_cost || "-",
    transport_cost: item.transport_cost || "-",
    description: item.description || "-",
    debit: item.debit || 0,
    credit: item.credit || 0,
  }));

  const columns = [
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "material_name", label: "Material" },
    { key: "site_name", label: "Site" },
    { key: "quantity", label: "Quantity" },
    { key: "unit_cost", label: "Unit Cost" },
    { key: "transport_cost", label: "Transport" },
    { key: "debit", label: "Purchase" },
    { key: "credit", label: "Payment" },
  ];

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateVendor(id, form);
      setEditing(false);
      await loadVendor();
      window.dispatchEvent(new Event("vendors:changed"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update vendor");
    } finally {
      setSaving(false);
    }
  };

  const handleFullPdf = () => {
    generateVendorReportPDF({
      vendor: vendor || {},
      transactions: rows,
      fileName: `${vendor?.vendor_name || "Vendor"} Full Report`,
    });
  };

  return (
    <div>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={headingStyle}>Vendor Profile</h1>

          {!loading && !error && vendor && (
            <div style={actionsStyle}>
              <button
                type="button"
                style={buttonStyle}
                onClick={() => setEditing((current) => !current)}
              >
                {editing ? "Cancel Edit" : "Edit Profile"}
              </button>
              <button type="button" style={pdfButtonStyle} onClick={handleFullPdf}>
                Full Vendor PDF
              </button>
            </div>
          )}
        </div>

        {loading && <p>Loading...</p>}
        {!loading && error && <p style={errorStyle}>{error}</p>}

        {!loading && !error && vendor && !editing && (
          <div style={detailGridStyle}>
            <Detail label="Vendor Name" value={vendor.vendor_name} />
            <Detail label="Contact" value={vendor.contact_number || "-"} />
            <Detail label="Email" value={vendor.email || "-"} />
            <Detail label="Address" value={vendor.address || "-"} />
            <Detail
              label="Total Purchase"
              value={`Rs. ${vendor.total_purchase || 0}`}
            />
            <Detail label="Paid Amount" value={`Rs. ${vendor.paid_amount || 0}`} />
            <Detail
              label="Pending Payment"
              value={`Rs. ${vendor.pending_amount || 0}`}
            />
          </div>
        )}

        {!loading && !error && vendor && editing && (
          <form onSubmit={handleSave} style={formStyle}>
            <Field
              label="Vendor Name"
              required
              value={form.vendor_name}
              onChange={(value) => handleChange("vendor_name", value)}
            />
            <Field
              label="Contact Number"
              value={form.contact_number}
              onChange={(value) => handleChange("contact_number", value)}
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => handleChange("email", value)}
            />
            <Field
              label="Address"
              value={form.address}
              onChange={(value) => handleChange("address", value)}
            />

            <button type="submit" style={saveButtonStyle} disabled={saving}>
              {saving ? "Saving..." : "Update Vendor Profile"}
            </button>
          </form>
        )}
      </div>

      {!loading && !error && vendor && (
        <div style={ledgerStyle}>
          <div style={headerStyle}>
            <h2 style={subHeadingStyle}>Vendor Ledger</h2>
            <div style={actionsStyle}>
              <PDFExport
                data={rows}
                columns={columns}
                fileName={`${vendor.vendor_name} Ledger`}
              />
              <ExcelExport
                data={rows}
                columns={columns}
                fileName={`${vendor.vendor_name} Ledger`}
              />
            </div>
          </div>

          <ReportTable
            title="Complete Transaction History"
            data={rows}
            columns={columns}
          />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <p style={detailStyle}>
      <strong>{label}:</strong> {value}
    </p>
  );
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "12px",
};

const headingStyle = {
  fontSize: "32px",
  fontWeight: "700",
  margin: 0,
};

const subHeadingStyle = {
  fontSize: "24px",
  fontWeight: "700",
  margin: 0,
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const actionsStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const detailGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
  fontSize: "18px",
};

const detailStyle = {
  margin: 0,
  lineHeight: "1.7",
};

const errorStyle = {
  color: "#dc2626",
  fontWeight: "600",
};

const ledgerStyle = {
  marginTop: "20px",
};

const formStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "5px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const buttonStyle = {
  padding: "12px 18px",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const saveButtonStyle = {
  ...buttonStyle,
  alignSelf: "end",
};

const pdfButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#7c3aed",
};

export default VendorDetails;
