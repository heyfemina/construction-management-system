import { useEffect, useMemo, useState } from "react";
import { getFinanceData } from "../../api/financeApi";

function FinanceReport() {
  const [finance, setFinance] = useState({
    expenses: [],
    receivables: [],
    payments: [],
  });

  const loadFinance = async () => {
    const response = await getFinanceData();
    setFinance({
      expenses: response.data.expenses || [],
      receivables: response.data.receivables || [],
      payments: response.data.payments || [],
    });
  };

  useEffect(() => {
    loadFinance();
    window.addEventListener("finance:changed", loadFinance);

    return () => {
      window.removeEventListener("finance:changed", loadFinance);
    };
  }, []);

  const summary = useMemo(
    () => ({
      totalExpenses: finance.expenses.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      ),
      totalReceived: finance.payments.reduce(
        (total, item) => total + Number(item.payment_amount || 0),
        0
      ),
      pendingAmount: finance.receivables.reduce(
        (total, item) => total + Number(item.pending_amount || 0),
        0
      ),
    }),
    [finance]
  );

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
        Finance Summary Report
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <ReportCard
          title="Total Expenses"
          value={`Rs. ${summary.totalExpenses}`}
        />
        <ReportCard
          title="Total Received"
          value={`Rs. ${summary.totalReceived}`}
        />
        <ReportCard
          title="Pending Amount"
          value={`Rs. ${summary.pendingAmount}`}
        />
      </div>
    </div>
  );
}

function ReportCard({ title, value }) {
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

export default FinanceReport;
