import { useEffect, useState } from "react";
import { deleteLabour, getLabours } from "../../services/labourService";
import ConfirmDialog from "../common/ConfirmDialog";
import ErrorDialog from "../common/ErrorDialog";
import Modal from "../common/Modal";
import Pagination from "../common/Pagination";
import ExcelExport from "../reports/ExcelExport";
import PDFExport from "../reports/PDFExport";
import usePagination from "../../hooks/usePagination";
import isConnectionError from "../../utils/isConnectionError";

function LabourTable() {
  const [labours, setLabours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dialogError, setDialogError] = useState("");
  const pagination = usePagination(labours, 10);

  const loadLabours = async () => {
    try {
      setLoading(true);
      const data = await getLabours();
      setLabours(data.labours || []);
      setError("");
    } catch (err) {
      if (isConnectionError(err)) {
        setLabours([]);
        setError("");
        return;
      }

      setError(err.response?.data?.message || "Could not load labour");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabours();
    window.addEventListener("labours:changed", loadLabours);

    return () => {
      window.removeEventListener("labours:changed", loadLabours);
    };
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteLabour(deleteTarget.id);
      setDeleteTarget(null);
      loadLabours();
    } catch (err) {
      setDeleteTarget(null);
      setDialogError(err.response?.data?.message || "Could not delete labour");
    }
  };

  const exportColumns = [
    { key: "labour_name", label: "Labour Name" },
    { key: "contact_number", label: "Contact" },
    { key: "site_name", label: "Site" },
    { key: "daily_wage", label: "Daily Wage" },
    { key: "attendance_count", label: "Attendance" },
    { key: "total_wage", label: "Total Wage" },
    { key: "pending_amount", label: "Pending" },
  ];

  return (
    <div style={tableWrapStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ ...headingStyle, marginBottom: 0 }}>Labour List</h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <PDFExport
            data={labours}
            columns={exportColumns}
            fileName="Labour Report"
          />

          <ExcelExport
            data={labours}
            columns={exportColumns}
            fileName="Labour Report"
          />
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={tableHead}>Name</th>
            <th style={tableHead}>Contact</th>
            <th style={tableHead}>Site</th>
            <th style={tableHead}>Daily Wage</th>
            <th style={tableHead}>Attendance</th>
            <th style={tableHead}>Total Wage</th>
            <th style={tableHead}>Pending</th>
            <th style={tableHead}>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading && <StatusRow text="Loading..." />}
          {!loading && error && <StatusRow text={error} />}
          {!loading && !error && labours.length === 0 && (
            <StatusRow text="No labour yet" />
          )}

          {!loading &&
            !error &&
            pagination.currentData.map((labour) => (
              <tr key={labour.id}>
                <td style={tableData}>{labour.labour_name}</td>
                <td style={tableData}>{labour.contact_number}</td>
                <td style={tableData}>{labour.site_name || "-"}</td>
                <td style={tableData}>Rs. {labour.daily_wage}</td>
                <td style={tableData}>{labour.attendance_count || 0}</td>
                <td style={tableData}>Rs. {labour.total_wage || 0}</td>
                <td style={tableData}>Rs. {labour.pending_amount || 0}</td>
                <td style={tableData}>
                  <button type="button" onClick={() => setDeleteTarget(labour)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onNext={pagination.nextPage}
        onPrevious={pagination.prevPage}
        totalItems={labours.length}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
      />
      <Modal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <ConfirmDialog
          title="Delete labour?"
          message={`This will delete ${deleteTarget?.labour_name || "this labour"}.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </Modal>
      <ErrorDialog
        isOpen={Boolean(dialogError)}
        message={dialogError}
        onClose={() => setDialogError("")}
      />
    </div>
  );
}

function StatusRow({ text }) {
  return (
    <tr>
      <td style={tableData} colSpan="8">
        {text}
      </td>
    </tr>
  );
}

const tableWrapStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "20px",
  overflowX: "auto",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "20px",
};

const tableHead = {
  borderBottom: "1px solid #d1d5db",
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#f3f4f6",
};

const tableData = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px",
};

export default LabourTable;
