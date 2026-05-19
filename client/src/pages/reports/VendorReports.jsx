import ReportFilter from "../../components/reports/ReportFilter";
import ReportTable from "../../components/reports/ReportTable";
import PDFExport from "../../components/reports/PDFExport";
import ExcelExport from "../../components/reports/ExcelExport";

function VendorReports() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "25px",
        }}
      >
        Vendor Reports
      </h1>

      <ReportFilter />

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <PDFExport />

        <ExcelExport />
      </div>

      <ReportTable />
    </div>
  );
}

export default VendorReports;