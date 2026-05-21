import { useCallback, useEffect, useMemo, useState } from "react";
import { getLabourLedger, getLabours } from "../../api/labourApi";
import ExcelExport from "../reports/ExcelExport";
import PDFExport from "../reports/PDFExport";
import ReportTable from "../reports/ReportTable";

function LabourLedger() {
  const [labours, setLabours] = useState([]);
  const [labourId, setLabourId] = useState("");
  const [ledger, setLedger] = useState(null);

  const loadLabours = useCallback(async () => {
    const response = await getLabours();
    const rows = response.data.labours || [];

    setLabours(rows);
    if (!labourId && rows[0]) {
      setLabourId(String(rows[0].id));
    }
  }, [labourId]);

  useEffect(() => {
    loadLabours();
    window.addEventListener("labours:changed", loadLabours);

    return () => {
      window.removeEventListener("labours:changed", loadLabours);
    };
  }, [loadLabours]);

  useEffect(() => {
    if (!labourId) {
      setLedger(null);
      return;
    }

    getLabourLedger(labourId)
      .then((response) => setLedger(response.data))
      .catch(() => setLedger(null));
  }, [labourId, labours]);

  const summary = useMemo(
    () =>
      labours.reduce(
        (total, labour) => ({
          totalWage:
            total.totalWage + Number(labour.total_wage || 0),
          paidAmount:
            total.paidAmount + Number(labour.paid_amount || 0),
          pendingAmount:
            total.pendingAmount + Number(labour.pending_amount || 0),
        }),
        {
          totalWage: 0,
          paidAmount: 0,
          pendingAmount: 0,
        }
      ),
    [labours]
  );

  const rows = useMemo(
    () =>
      labours.map((labour) => ({
        id: labour.id,
        labour_name: labour.labour_name,
        site_name: labour.site_name || "-",
        total_wage: labour.total_wage || 0,
        paid_amount: labour.paid_amount || 0,
        pending_amount: labour.pending_amount || 0,
      })),
    [labours]
  );

  const columns = [
    { key: "labour_name", label: "Labour" },
    { key: "site_name", label: "Site" },
    { key: "total_wage", label: "Total Wage" },
    { key: "paid_amount", label: "Paid" },
    { key: "pending_amount", label: "Pending" },
  ];

  const transactionRows = useMemo(
    () =>
      (ledger?.transactions || []).map((item) => ({
        id: `${item.type}-${item.id}`,
        date: item.transaction_date
          ? new Date(item.transaction_date).toLocaleDateString("en-IN")
          : "-",
        type: item.type,
        description: item.description || "-",
        total_days: item.total_days || "-",
        rate_per_day: item.rate_per_day || "-",
        debit: item.debit || 0,
        credit: item.credit || 0,
      })),
    [ledger]
  );

  const transactionColumns = [
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "description", label: "Details" },
    { key: "total_days", label: "Days" },
    { key: "rate_per_day", label: "Rate" },
    { key: "debit", label: "Wage" },
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
          Labour Ledger
        </h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <PDFExport data={rows} columns={columns} fileName="Labour Ledger" />
          <ExcelExport data={rows} columns={columns} fileName="Labour Ledger" />
        </div>
      </div>

      <select
        value={labourId}
        onChange={(e) => setLabourId(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select labour</option>
        {labours.map((labour) => (
          <option key={labour.id} value={labour.id}>
            {labour.labour_name}
          </option>
        ))}
      </select>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <LedgerCard title="Total Wage" value={`Rs. ${summary.totalWage}`} />
        <LedgerCard title="Paid Amount" value={`Rs. ${summary.paidAmount}`} />
        <LedgerCard
          title="Pending Amount"
          value={`Rs. ${summary.pendingAmount}`}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <ReportTable
          title="Individual Balances"
          data={rows}
          columns={columns}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <ReportTable
          title={`${ledger?.labour?.labour_name || "Labour"} Transaction History`}
          data={transactionRows}
          columns={transactionColumns}
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

const cardStyle = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

export default LabourLedger;
