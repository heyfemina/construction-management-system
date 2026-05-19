import StockTable from "../../components/materials/StockTable";

function StockManagement() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Stock Management
      </h1>

      <StockTable />
    </div>
  );
}

export default StockManagement;