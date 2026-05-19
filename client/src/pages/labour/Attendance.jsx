import AttendanceForm from "../../components/labour/AttendanceForm";

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
    </div>
  );
}

export default Attendance;