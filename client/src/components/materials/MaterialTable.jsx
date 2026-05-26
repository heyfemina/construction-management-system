import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteMaterial, getMaterials } from "../../services/materialService";
import ConfirmDialog from "../common/ConfirmDialog";
import ErrorDialog from "../common/ErrorDialog";
import Modal from "../common/Modal";
import Pagination from "../common/Pagination";
import ExcelExport from "../reports/ExcelExport";
import PDFExport from "../reports/PDFExport";
import usePagination from "../../hooks/usePagination";
import isConnectionError from "../../utils/isConnectionError";

function MaterialTable() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dialogError, setDialogError] = useState("");
  const pagination = usePagination(materials, 10);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await getMaterials();
      setMaterials(data.materials || []);
      setError("");
    } catch (err) {
      if (isConnectionError(err)) {
        setMaterials([]);
        setError("");
        return;
      }

      setError(err.response?.data?.message || "Could not load materials");
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

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMaterial(deleteTarget.id);
      setDeleteTarget(null);
      loadMaterials();
    } catch (err) {
      setDeleteTarget(null);
      setDialogError(err.response?.data?.message || "Could not delete material");
    }
  };

  const exportColumns = [
    { key: "material_name", label: "Material Name" },
    { key: "site_name", label: "Site" },
    { key: "unit", label: "Unit" },
    { key: "total_received", label: "Received" },
    { key: "total_used", label: "Used" },
    { key: "remaining_stock", label: "Remaining" },
    { key: "avg_unit_cost", label: "Cost / Unit" },
    { key: "total_cost", label: "Cost" },
    { key: "transport_cost", label: "Transport" },
  ];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
        overflowX: "auto",
      }}
    >
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
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            margin: 0,
          }}
        >
          Materials List
        </h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <PDFExport
            data={materials}
            columns={exportColumns}
            fileName="Material Report"
          />

          <ExcelExport
            data={materials}
            columns={exportColumns}
            fileName="Material Report"
          />
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={tableHead}>Material Name</th>
            <th style={tableHead}>Site</th>
            <th style={tableHead}>Unit</th>
            <th style={tableHead}>Received</th>
            <th style={tableHead}>Used</th>
            <th style={tableHead}>Remaining</th>
            <th style={tableHead}>Cost / Unit</th>
            <th style={tableHead}>Transport Cost</th>
            <th style={tableHead}>Total Cost</th>
            <th style={tableHead}>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td style={tableData} colSpan="10">Loading...</td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td style={tableData} colSpan="10">{error}</td>
            </tr>
          )}

          {!loading && !error && materials.length === 0 && (
            <tr>
              <td style={tableData} colSpan="10">No materials yet</td>
            </tr>
          )}

          {!loading && !error && pagination.currentData.map((material) => (
            <tr key={material.id}>
              <td style={tableData}>{material.material_name}</td>
              <td style={tableData}>{material.site_name || "-"}</td>
              <td style={tableData}>{material.unit}</td>
              <td style={tableData}>{material.total_received || 0}</td>
              <td style={tableData}>{material.total_used || 0}</td>
              <td style={tableData}>{material.remaining_stock || 0}</td>
              <td style={tableData}>Rs. {formatNumber(material.avg_unit_cost)}</td>
              <td style={tableData}>Rs. {formatNumber(material.transport_cost)}</td>
              <td style={tableData}>Rs. {formatNumber(material.total_cost)}</td>
              <td style={tableData}>
                <Link to={`/materials/details/${material.id}`} style={linkStyle}>
                  View
                </Link>
                <Link to={`/materials/edit/${material.id}`} style={linkStyle}>
                  Edit
                </Link>
                <button type="button" onClick={() => setDeleteTarget(material)}>
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
        totalItems={materials.length}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
      />
      <Modal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <ConfirmDialog
          title="Delete material?"
          message={`This will delete ${deleteTarget?.material_name || "this material"}.`}
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

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

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

const linkStyle = {
  marginRight: "10px",
  color: "#2563eb",
  fontWeight: "600",
  textDecoration: "none",
};

export default MaterialTable;
