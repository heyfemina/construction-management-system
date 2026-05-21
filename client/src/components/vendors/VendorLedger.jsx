import { useEffect, useMemo, useState } from "react";
import { getVendorLedger, getVendors } from "../../api/vendorApi";
import ExcelExport from "../reports/ExcelExport";
import PDFExport from "../reports/PDFExport";
import ReportTable from "../reports/ReportTable";
import generateVendorReportPDF from "../../utils/generateVendorReportPDF";

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
        material_name: item.material_name || "-",
        site_name: item.site_name || "-",
        quantity: item.quantity || "-",
        unit_cost: item.unit_cost || "-",
        transport_cost: item.transport_cost || "-",
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

  const fullColumns = [
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

  const handleFullPdf = () => {
    generateVendorReportPDF({
      vendor: ledger?.vendor || {},
      transactions: rows,
      fileName: `${ledger?.vendor?.vendor_name || "Vendor"} Full Report`,
    });
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

        <ExcelExport
          data={rows}
          columns={fullColumns}
          fileName={`${ledger?.vendor?.vendor_name || "Vendor"} Ledger`}
        />

        <button type="button" onClick={handleFullPdf} style={fullPdfButton}>
          Full Vendor PDF
        </button>
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

      <div style={{ marginTop: "20px" }}>
        <ReportTable
          title="Transaction History"
          data={rows}
          columns={fullColumns}
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

const fullPdfButton = {
  backgroundColor: "#7c3aed",
  color: "#ffffff",
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default VendorLedger;
