import { useEffect, useMemo, useState } from "react";
import { getVendors } from "../../api/vendorApi";

function VendorReport() {
  const [vendors, setVendors] = useState([]);

  const loadVendors = async () => {
    const response = await getVendors();
    setVendors(response.data.vendors || []);
  };

  useEffect(() => {
    loadVendors();
    window.addEventListener("vendors:changed", loadVendors);

    return () => {
      window.removeEventListener("vendors:changed", loadVendors);
    };
  }, []);

  const summary = useMemo(
    () =>
      vendors.reduce(
        (total, vendor) => ({
          totalVendors: total.totalVendors + 1,
          totalPurchases:
            total.totalPurchases + Number(vendor.total_purchase || 0),
          pendingPayments:
            total.pendingPayments + Number(vendor.pending_amount || 0),
        }),
        {
          totalVendors: 0,
          totalPurchases: 0,
          pendingPayments: 0,
        }
      ),
    [vendors]
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
        Vendor Report
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <ReportCard title="Total Vendors" value={summary.totalVendors} />
        <ReportCard
          title="Total Purchases"
          value={`Rs. ${summary.totalPurchases}`}
        />
        <ReportCard
          title="Pending Payments"
          value={`Rs. ${summary.pendingPayments}`}
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

export default VendorReport;
