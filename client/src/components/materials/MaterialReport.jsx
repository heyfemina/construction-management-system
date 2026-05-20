import { useEffect, useMemo, useState } from "react";
import { getMaterials } from "../../api/materialApi";

function MaterialReport() {
  const [materials, setMaterials] = useState([]);

  const loadMaterials = async () => {
    const response = await getMaterials();
    setMaterials(response.data.materials || []);
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
          totalMaterials: total.totalMaterials + 1,
          totalStock:
            total.totalStock + Number(material.remaining_stock || 0),
          totalCost:
            total.totalCost + Number(material.total_cost || 0),
        }),
        {
          totalMaterials: 0,
          totalStock: 0,
          totalCost: 0,
        }
      ),
    [materials]
  );

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Material Report
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <ReportCard title="Total Materials" value={summary.totalMaterials} />
        <ReportCard title="Remaining Stock" value={summary.totalStock} />
        <ReportCard
          title="Total Material Cost"
          value={`Rs. ${summary.totalCost}`}
        />
      </div>
    </div>
  );
}

function ReportCard({ title, value }) {
  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
};

export default MaterialReport;
