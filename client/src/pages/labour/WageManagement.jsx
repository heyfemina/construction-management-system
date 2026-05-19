import WageForm from "../../components/labour/WageForm";

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
    </div>
  );
}

export default WageManagement;