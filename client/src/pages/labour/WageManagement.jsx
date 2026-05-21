import WageForm from "../../components/labour/WageForm";
import LabourPaymentForm from "../../components/labour/LabourPaymentForm";

function WageManagement() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Wage Management
      </h1>

      <WageForm />
      <LabourPaymentForm />
    </div>
  );
}

export default WageManagement;
