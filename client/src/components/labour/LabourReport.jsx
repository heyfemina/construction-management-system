import { useEffect, useMemo, useState } from "react";
import {
  getLabourActivity,
  getLabours,
} from "../../api/labourApi";

function LabourReport() {
  const [labours, setLabours] = useState([]);
  const [activity, setActivity] = useState({
    attendance: [],
    wages: [],
  });

  const loadReport = async () => {
    const [laboursResponse, activityResponse] =
      await Promise.all([getLabours(), getLabourActivity()]);

    setLabours(laboursResponse.data.labours || []);
    setActivity({
      attendance: activityResponse.data.attendance || [],
      wages: activityResponse.data.wages || [],
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
        Labour Report
      </h2>

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

export default LabourReport;
