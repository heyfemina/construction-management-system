import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSiteReport } from "../../api/siteApi";
import ExcelExport from "../../components/reports/ExcelExport";
import PDFExport from "../../components/reports/PDFExport";
import ReportTable from "../../components/reports/ReportTable";

function SiteDetails() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [report, setReport] = useState({
    materials: [],
    labours: [],
    vendors: [],
    expenses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSite = async () => {
      try {
        setLoading(true);
        const response = await getSiteReport(id);
        setSite(response.data.site);
        setReport({
          materials: response.data.materials || [],
          labours: response.data.labours || [],
          vendors: response.data.vendors || [],
          expenses: response.data.expenses || [],
        });
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Could not load site");
      } finally {
        setLoading(false);
      }
    };

    loadSite();
  }, [id]);

  const materialColumns = [
    { key: "material_name", label: "Material" },
    { key: "unit", label: "Unit" },
    { key: "total_received", label: "Received" },
    { key: "total_used", label: "Used" },
    { key: "remaining_stock", label: "Remaining" },
    { key: "total_cost", label: "Cost" },
  ];

  const labourColumns = [
    { key: "labour_name", label: "Labour" },
    { key: "contact_number", label: "Contact" },
    { key: "daily_wage", label: "Daily Wage" },
    { key: "total_wage", label: "Total Wage" },
    { key: "pending_amount", label: "Pending" },
  ];

  const vendorColumns = [
    { key: "vendor_name", label: "Vendor" },
    { key: "contact_number", label: "Contact" },
    { key: "email", label: "Email" },
    { key: "total_purchase", label: "Purchase" },
    { key: "pending_amount", label: "Pending" },
  ];

  const expenseColumns = [
    { key: "expense_type", label: "Expense" },
    { key: "amount", label: "Amount" },
    { key: "expense_date", label: "Date" },
    { key: "description", label: "Description" },
  ];

  const allRows = [
    ...report.materials.map((item) => ({
      section: "Material",
      name: item.material_name,
      amount: item.total_cost,
      detail: `${item.remaining_stock || 0} ${item.unit || ""} remaining`,
    })),
    ...report.labours.map((item) => ({
      section: "Labour",
      name: item.labour_name,
      amount: item.total_wage,
      detail: `Pending Rs. ${item.pending_amount || 0}`,
    })),
    ...report.vendors.map((item) => ({
      section: "Vendor",
      name: item.vendor_name,
      amount: item.total_purchase,
      detail: `Pending Rs. ${item.pending_amount || 0}`,
    })),
    ...report.expenses.map((item) => ({
      section: "Expense",
      name: item.expense_type,
      amount: item.amount,
      detail: item.description || "-",
    })),
  ];

  const allColumns = [
    { key: "section", label: "Section" },
    { key: "name", label: "Name" },
    { key: "amount", label: "Amount" },
    { key: "detail", label: "Details" },
  ];

  return (
    <div>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={headingStyle}>Site Details</h1>

          {!loading && !error && site && (
            <div style={actionsStyle}>
              <PDFExport
                data={allRows}
                columns={allColumns}
                fileName={`${site.site_name} Site Report`}
              />
              <ExcelExport
                data={allRows}
                columns={allColumns}
                fileName={`${site.site_name} Site Report`}
              />
            </div>
          )}
        </div>

        {loading && <p>Loading...</p>}
        {!loading && error && <p style={errorStyle}>{error}</p>}

        {!loading && !error && site && (
          <div style={detailGridStyle}>
            <Detail label="Site Name" value={site.site_name} />
            <Detail label="Location" value={site.location || "-"} />
            <Detail label="Description" value={site.description || "-"} />
            <Detail label="Total Expense" value={`Rs. ${site.total_expense || 0}`} />
            <Detail
              label="Material Cost"
              value={`Rs. ${site.material_cost || 0}`}
            />
            <Detail label="Labour Cost" value={`Rs. ${site.labour_cost || 0}`} />
            <Detail label="Labour Count" value={site.labour_count || 0} />
            <Detail label="Vendors" value={report.vendors.length} />
          </div>
        )}
      </div>

      {!loading && !error && site && (
        <div style={tablesStyle}>
          <ReportTable
            title="Site Materials"
            data={report.materials}
            columns={materialColumns}
          />
          <ReportTable
            title="Site Labour"
            data={report.labours}
            columns={labourColumns}
          />
          <ReportTable
            title="Site Vendors"
            data={report.vendors}
            columns={vendorColumns}
          />
          <ReportTable
            title="Site Expenses"
            data={report.expenses}
            columns={expenseColumns}
          />
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <p style={detailStyle}>
      <strong>{label}:</strong> {value}
    </p>
  );
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "12px",
};

const headingStyle = {
  fontSize: "32px",
  fontWeight: "700",
  margin: 0,
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const actionsStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const detailGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
  fontSize: "18px",
};

const detailStyle = {
  margin: 0,
  lineHeight: "1.7",
};

const errorStyle = {
  color: "#dc2626",
  fontWeight: "600",
};

const tablesStyle = {
  display: "grid",
  gap: "20px",
  marginTop: "20px",
};

export default SiteDetails;
