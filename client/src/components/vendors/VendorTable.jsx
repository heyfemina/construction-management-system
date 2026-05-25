import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteVendor, getVendors } from "../../services/vendorService";
import ConfirmDialog from "../common/ConfirmDialog";
import ErrorDialog from "../common/ErrorDialog";
import Modal from "../common/Modal";
import Pagination from "../common/Pagination";
import ExcelExport from "../reports/ExcelExport";
import PDFExport from "../reports/PDFExport";
import usePagination from "../../hooks/usePagination";
import isConnectionError from "../../utils/isConnectionError";

function VendorTable() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dialogError, setDialogError] = useState("");
  const pagination = usePagination(vendors, 10);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await getVendors();
      setVendors(data.vendors || []);
      setError("");
    } catch (err) {
      if (isConnectionError(err)) {
        setVendors([]);
        setError("");
        return;
      }

      setError(err.response?.data?.message || "Could not load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
    window.addEventListener("vendors:changed", loadVendors);

    return () => {
      window.removeEventListener("vendors:changed", loadVendors);
    };
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteVendor(deleteTarget.id);
      setDeleteTarget(null);
      loadVendors();
    } catch (err) {
      setDeleteTarget(null);
      setDialogError(err.response?.data?.message || "Could not delete vendor");
    }
  };

  const handleEdit = (vendor) => {
    window.dispatchEvent(
      new CustomEvent("vendors:edit", {
        detail: vendor,
      })
    );
  };

  const exportColumns = [
    { key: "vendor_name", label: "Vendor Name" },
    { key: "site_name", label: "Site" },
    { key: "contact_number", label: "Contact" },
    { key: "email", label: "Email" },
    { key: "total_purchase", label: "Purchase" },
    { key: "paid_amount", label: "Paid" },
    { key: "pending_amount", label: "Pending" },
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
          Vendor List
        </h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <PDFExport
            data={vendors}
            columns={exportColumns}
            fileName="Vendor Report"
          />

          <ExcelExport
            data={vendors}
            columns={exportColumns}
            fileName="Vendor Report"
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
            <th style={tableHead}>Vendor Name</th>
            <th style={tableHead}>Site</th>
            <th style={tableHead}>Contact</th>
            <th style={tableHead}>Email</th>
            <th style={tableHead}>Purchase</th>
            <th style={tableHead}>Paid</th>
            <th style={tableHead}>Pending</th>
            <th style={tableHead}>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td style={tableData} colSpan="8">Loading...</td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td style={tableData} colSpan="8">{error}</td>
            </tr>
          )}

          {!loading && !error && vendors.length === 0 && (
            <tr>
              <td style={tableData} colSpan="8">No vendors yet</td>
            </tr>
          )}

          {!loading && !error && pagination.currentData.map((vendor) => (
            <tr key={vendor.id}>
              <td style={tableData}>{vendor.vendor_name}</td>
              <td style={tableData}>{vendor.site_name || "-"}</td>
              <td style={tableData}>{vendor.contact_number}</td>
              <td style={tableData}>{vendor.email}</td>
              <td style={tableData}>Rs. {vendor.total_purchase || 0}</td>
              <td style={tableData}>Rs. {vendor.paid_amount || 0}</td>
              <td style={tableData}>Rs. {vendor.pending_amount || 0}</td>
              <td style={tableData}>
                <Link to={`/vendors/details/${vendor.id}`} style={linkStyle}>
                  View
                </Link>
                <button
                  type="button"
                  style={actionButtonStyle}
                  onClick={() => handleEdit(vendor)}
                >
                  Edit
                </button>
                <button type="button" onClick={() => setDeleteTarget(vendor)}>
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
        totalItems={vendors.length}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
      />
      <Modal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <ConfirmDialog
          title="Delete vendor?"
          message={`This will delete ${deleteTarget?.vendor_name || "this vendor"}.`}
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

const actionButtonStyle = {
  marginRight: "10px",
};

export default VendorTable;
