import { useCallback, useEffect, useMemo, useState } from "react";
import { getFinanceData, getPartyLedger } from "../../api/financeApi";
import ExcelExport from "../reports/ExcelExport";
import PDFExport from "../reports/PDFExport";
import ReportTable from "../reports/ReportTable";

function PartyLedger() {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [ledger, setLedger] = useState(null);

  const loadClients = useCallback(() => {
    getFinanceData()
      .then((response) => {
        const rows = response.data.clients || [];
        setClients(rows);
        if (!clientId && rows[0]) {
          setClientId(String(rows[0].id));
        }
      })
      .catch(() => setClients([]));
  }, [clientId]);

  useEffect(() => {
    loadClients();
    window.addEventListener("finance:changed", loadClients);

    return () => {
      window.removeEventListener("finance:changed", loadClients);
    };
  }, [loadClients]);

  useEffect(() => {
    if (!clientId) {
      setLedger(null);
      return;
    }

    getPartyLedger(clientId)
      .then((response) => setLedger(response.data))
      .catch(() => setLedger(null));
  }, [clientId, clients]);

  const rows = useMemo(
    () =>
      (ledger?.transactions || []).map((item) => ({
        id: `${item.type}-${item.id}`,
        date: item.transaction_date
          ? new Date(item.transaction_date).toLocaleDateString("en-IN")
          : "-",
        type: item.type,
        details: item.description || "-",
        receivable: item.debit || 0,
        received: item.received || item.credit || 0,
        pending: item.pending || 0,
      })),
    [ledger]
  );

  const columns = [
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "details", label: "Details" },
    { key: "receivable", label: "Receivable" },
    { key: "received", label: "Received" },
    { key: "pending", label: "Pending" },
  ];

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h2 style={headingStyle}>Party Ledger</h2>

        <div style={actionsStyle}>
          <PDFExport
            data={rows}
            columns={columns}
            fileName={`${ledger?.party?.client_name || "Party"} Ledger`}
          />
          <ExcelExport
            data={rows}
            columns={columns}
            fileName={`${ledger?.party?.client_name || "Party"} Ledger`}
          />
        </div>
      </div>

      <select
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select client or party</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.client_name}
          </option>
        ))}
      </select>

      <div style={summaryGridStyle}>
        <LedgerCard
          title="Amount To Receive"
          value={`Rs. ${ledger?.party?.total_receivable || 0}`}
        />
        <LedgerCard
          title="Payment Received"
          value={`Rs. ${ledger?.party?.payment_received || 0}`}
        />
        <LedgerCard
          title="Pending"
          value={`Rs. ${ledger?.party?.pending_amount || 0}`}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <ReportTable
          title="Party Transaction History"
          data={rows}
          columns={columns}
        />
      </div>
    </div>
  );
}

function LedgerCard({ title, value }) {
  return (
    <div style={summaryCardStyle}>
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "12px",
  marginTop: "20px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "700",
  margin: 0,
};

const actionsStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
  marginTop: "20px",
};

const summaryCardStyle = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
};

export default PartyLedger;
