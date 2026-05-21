import { useEffect, useMemo, useState } from "react";
import {
  getLabourActivity,
  getLabours,
} from "../../api/labourApi";

function LabourReport() {
  const [labours, setLabours] = useState([]);
  const [period, setPeriod] = useState("daily");
  const [activity, setActivity] = useState({
    attendance: [],
    wages: [],
    payments: [],
    summaries: {
      daily: [],
      weekly: [],
      monthly: [],
    },
  });

  const loadReport = async () => {
    const [laboursResponse, activityResponse] =
      await Promise.all([getLabours(), getLabourActivity()]);

    setLabours(laboursResponse.data.labours || []);
    setActivity({
      attendance: activityResponse.data.attendance || [],
      wages: activityResponse.data.wages || [],
      payments: activityResponse.data.payments || [],
      summaries: activityResponse.data.summaries || {
        daily: [],
        weekly: [],
        monthly: [],
      },
    });
  };

  useEffect(() => {
    loadReport();
    window.addEventListener("labours:changed", loadReport);

    return () => {
      window.removeEventListener("labours:changed", loadReport);
    };
  }, []);

  const totalCost = useMemo(
    () =>
      activity.wages.reduce(
        (total, wage) => total + Number(wage.total_amount || 0),
        0
      ),
    [activity.wages]
  );

  const totalPaid = useMemo(
    () =>
      activity.payments.reduce(
        (total, payment) => total + Number(payment.paid_amount || 0),
        0
      ),
    [activity.payments]
  );

  const reportRows = useMemo(() => {
    const rows = activity.summaries?.[period] || [];

    return rows.map((item) => ({
      period_start: formatDate(item.period_start),
      worker_count: item.worker_count || 0,
    }));
  }, [activity.summaries, period]);

  const periodLabels = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
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
      <div style={headerStyle}>
        <h2 style={headingStyle}>Labour Report</h2>

        <div style={tabsStyle}>
          {Object.entries(periodLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPeriod(key)}
              style={{
                ...tabButtonStyle,
                ...(period === key ? activeTabStyle : {}),
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <ReportCard title="Total Workers" value={labours.length} />
        <ReportCard
          title="Attendance Records"
          value={activity.attendance.length}
        />
        <ReportCard title="Total Labour Cost" value={`Rs. ${totalCost}`} />
        <ReportCard title="Paid Amount" value={`Rs. ${totalPaid}`} />
        <ReportCard
          title="Pending Dues"
          value={`Rs. ${totalCost - totalPaid}`}
        />
      </div>

      <div style={{ marginTop: "20px", overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHead}>{periodLabels[period]} Period</th>
              <th style={tableHead}>Workers Present</th>
            </tr>
          </thead>

          <tbody>
            {reportRows.length === 0 && (
              <tr>
                <td style={tableData} colSpan="2">
                  No labour attendance for this period
                </td>
              </tr>
            )}

            {reportRows.map((row) => (
              <tr key={row.period_start}>
                <td style={tableData}>{row.period_start}</td>
                <td style={tableData}>{row.worker_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

const tabsStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const tabButtonStyle = {
  padding: "10px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  fontWeight: "600",
};

const activeTabStyle = {
  backgroundColor: "#2563eb",
  borderColor: "#2563eb",
  color: "#ffffff",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHead = {
  borderBottom: "1px solid #d1d5db",
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#f3f4f6",
};

const tableData = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px",
};

export default LabourReport;
