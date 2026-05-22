import LabourForm from "../../components/labour/LabourForm";
import AttendanceForm from "../../components/labour/AttendanceForm";
import LabourTable from "../../components/labour/LabourTable";
import LabourLedger from "../../components/labour/LabourLedger";
import LabourReport from "../../components/labour/LabourReport";

function Labour() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "25px",
        }}
      >
        Labour Management
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(400px,1fr))",
          gap: "20px",
        }}
      >
        <LabourForm />

        <AttendanceForm />
      </div>

      <LabourTable />

      <LabourLedger />

      <LabourReport />
    </div>
  );
}

export default Labour;
