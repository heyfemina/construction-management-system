import ReceivableTable from "../../components/finance/ReceivableTable";

function Receivables() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Receivables
      </h1>

      <ReceivableTable />
    </div>
  );
}

export default Receivables;