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
        Wage & Payments
      </h1>

      <p style={helperStyle}>
        First generate the wage amount earned by labour. Then record the actual
        payment made against the pending wage balance.
      </p>

      <WageForm />
      <LabourPaymentForm />
    </div>
  );
}

const helperStyle = {
  color: "#6b7280",
  fontWeight: "600",
  margin: "-8px 0 20px",
};

export default WageManagement;
