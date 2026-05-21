import AttendanceForm from "../../components/labour/AttendanceForm";
import AttendanceList from "../../components/labour/AttendanceList";

function Attendance() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Labour Attendance
      </h1>

      <AttendanceForm />
      <AttendanceList />
    </div>
  );
}

export default Attendance;
