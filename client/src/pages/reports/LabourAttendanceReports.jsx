import AttendanceForm from "../../components/labour/AttendanceForm";
import ReportPage from "./ReportPage";

function LabourAttendanceReports() {
  return (
    <div>
      <AttendanceForm />
      <div style={{ marginTop: "22px" }}>
        <ReportPage type="labour-attendance" />
      </div>
    </div>
  );
}

export default LabourAttendanceReports;
