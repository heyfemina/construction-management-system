import { useEffect, useMemo, useState } from "react";
import MaterialForm from "../../components/materials/MaterialForm";
import MaterialTable from "../../components/materials/MaterialTable";
import StockTable from "../../components/materials/StockTable";
import PurchaseForm from "../../components/materials/PurchaseForm";
import UsageForm from "../../components/materials/UsageForm";
import MaterialReport from "../../components/materials/MaterialReport";
import { getMaterials } from "../../api/materialApi";
import isConnectionError from "../../utils/isConnectionError";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await getMaterials();
      setMaterials(response.data.materials || []);
    } catch (err) {
      if (isConnectionError(err)) {
        setMaterials([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
    window.addEventListener("materials:changed", loadMaterials);

    return () => {
      window.removeEventListener("materials:changed", loadMaterials);
    };
  }, []);

  const summary = useMemo(
    () =>
      materials.reduce(
        (total, material) => ({
          totalQuantity:
            total.totalQuantity + Number(material.total_received || 0),
          remainingStock:
            total.remainingStock + Number(material.remaining_stock || 0),
        }),
        {
          totalQuantity: 0,
          remainingStock: 0,
        }
      ),
    [materials]
  );

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
          alignItems: "stretch",
        }}
      >
        <SummaryCard
          title="Total Quantity"
          value={loading ? "-" : summary.totalQuantity}
          detail="All received material quantity"
        />

        <SummaryCard
          title="Remaining Stock"
          value={loading ? "-" : summary.remainingStock}
          detail="Available material balance"
          tone="#059669"
        />
      </div>

      <div className="material-forms-grid">
        <div className="material-form-sidebar">
          <MaterialForm />
        </div>

        <div className="material-form-main">
          <PurchaseForm />
        </div>
      </div>

      <UsageForm />

      <MaterialTable />

      <StockTable />

      <MaterialReport />
    </div>
  );
}

function SummaryCard({ title, value, detail, tone = "#2563eb" }) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "132px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#64748b",
          fontWeight: "700",
          fontSize: "14px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: "10px 0 6px",
          fontSize: "34px",
          lineHeight: "1",
          fontWeight: "800",
          color: tone,
        }}
      >
        {value}
      </h2>

      <p
        style={{
          margin: 0,
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        {detail}
      </p>
    </div>
  );
}

export default Materials;
