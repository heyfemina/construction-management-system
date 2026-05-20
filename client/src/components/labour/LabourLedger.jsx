import { useEffect, useMemo, useState } from "react";
import { getLabours } from "../../api/labourApi";

function LabourLedger() {
  const [labours, setLabours] = useState([]);

  const loadLabours = async () => {
    const response = await getLabours();
    setLabours(response.data.labours || []);
  };

  useEffect(() => {
    loadLabours();
    window.addEventListener("labours:changed", loadLabours);

    return () => {
      window.removeEventListener("labours:changed", loadLabours);
    };
  }, []);

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
        Labour Ledger
      </h2>

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

export default LabourLedger;
