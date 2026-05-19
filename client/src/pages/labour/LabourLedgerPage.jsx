import LabourLedger from "../../components/labour/LabourLedger";

function LabourLedgerPage() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Labour Ledger
      </h1>

      <LabourLedger />
    </div>
  );
}

export default LabourLedgerPage;