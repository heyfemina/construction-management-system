import { useEffect, useMemo, useState } from "react";
import { getVendorLedger, getVendors } from "../../api/vendorApi";
import PDFExport from "../reports/PDFExport";

function VendorLedger() {
  const [vendors, setVendors] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [ledger, setLedger] = useState(null);

  useEffect(() => {
    getVendors()
      .then((response) => {
        const rows = response.data.vendors || [];
        setVendors(rows);
        if (rows[0]) {
          setVendorId(String(rows[0].id));
        }
      })
      .catch(() => setVendors([]));
  }, []);

  useEffect(() => {
    if (!vendorId) {
      setLedger(null);
      return;
    }

    getVendorLedger(vendorId)
      .then((response) => setLedger(response.data))
      .catch(() => setLedger(null));
  }, [vendorId]);

  const rows = useMemo(
    () =>
      (ledger?.transactions || []).map((item) => ({
        date: item.transaction_date
          ? new Date(item.transaction_date).toLocaleDateString()
          : "-",
        type: item.type,
        description: item.description || "-",
        debit: item.debit || 0,
        credit: item.credit || 0,
      })),
    [ledger]
  );

  const columns = [
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "description", label: "Details" },
    { key: "debit", label: "Purchase" },
    { key: "credit", label: "Payment" },
  ];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            margin: 0,
          }}
        >
          Vendor Ledger
        </h2>

        <PDFExport
          data={rows}
          columns={columns}
          fileName={`${ledger?.vendor?.vendor_name || "Vendor"} Ledger`}
        />
      </div>

      <select
        value={vendorId}
        onChange={(e) => setVendorId(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select vendor</option>
        {vendors.map((vendor) => (
          <option key={vendor.id} value={vendor.id}>
            {vendor.vendor_name}
          </option>
        ))}
      </select>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <LedgerCard
          title="Total Purchase"
          value={`Rs. ${ledger?.vendor?.total_purchase || 0}`}
        />
        <LedgerCard
          title="Paid Amount"
          value={`Rs. ${ledger?.vendor?.paid_amount || 0}`}
        />
        <LedgerCard
          title="Pending Amount"
          value={`Rs. ${ledger?.vendor?.pending_amount || 0}`}
        />
      </div>
    </div>
  );
}

function LedgerCard({ title, value }) {
  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const cardStyle = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
};

export default VendorLedger;
