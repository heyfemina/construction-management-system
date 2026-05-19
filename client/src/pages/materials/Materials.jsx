import MaterialForm from "../../components/materials/MaterialForm";
import MaterialTable from "../../components/materials/MaterialTable";
import MaterialCard from "../../components/materials/MaterialCard";
import StockTable from "../../components/materials/StockTable";
import PurchaseForm from "../../components/materials/PurchaseForm";
import UsageForm from "../../components/materials/UsageForm";
import MaterialReport from "../../components/materials/MaterialReport";

function Materials() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "25px",
        }}
      >
        Material Management
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        <MaterialCard
          materialName="Cement"
          quantity="500"
          remaining="200"
        />

        <MaterialCard
          materialName="Steel"
          quantity="100"
          remaining="60"
        />

        <MaterialCard
          materialName="Sand"
          quantity="300"
          remaining="150"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(400px,1fr))",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        <MaterialForm />

        <PurchaseForm />
      </div>

      <UsageForm />

      <MaterialTable />

      <StockTable />

      <MaterialReport />
    </div>
  );
}

export default Materials;