import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteSite, getSites } from "../../services/siteService";
import ConfirmDialog from "../common/ConfirmDialog";
import ErrorDialog from "../common/ErrorDialog";
import Modal from "../common/Modal";
import Pagination from "../common/Pagination";
import usePagination from "../../hooks/usePagination";
import isConnectionError from "../../utils/isConnectionError";

function SiteTable() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dialogError, setDialogError] = useState("");
  const pagination = usePagination(sites, 10);

  const loadSites = async () => {
    try {
      setLoading(true);
      const data = await getSites();
      setSites(data.sites || []);
      setError("");
    } catch (err) {
      if (isConnectionError(err)) {
        setSites([]);
        setError("");
        return;
      }

      setError(err.response?.data?.message || "Could not load sites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
    window.addEventListener("sites:changed", loadSites);

    return () => {
      window.removeEventListener("sites:changed", loadSites);
    };
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteSite(deleteTarget.id);
      setDeleteTarget(null);
      loadSites();
    } catch (err) {
      setDeleteTarget(null);
      setDialogError(err.response?.data?.message || "Could not delete site");
    }
  };

  const handleEdit = (site) => {
    window.dispatchEvent(
      new CustomEvent("sites:edit", {
        detail: site,
      })
    );
  };

  return (
    <div style={tableWrapStyle}>
      <h2 style={headingStyle}>Sites List</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={tableHead}>Site Name</th>
            <th style={tableHead}>Location</th>
            <th style={tableHead}>Description</th>
            <th style={tableHead}>Material Cost</th>
            <th style={tableHead}>Expenses</th>
            <th style={tableHead}>Materials</th>
            <th style={tableHead}>Labours</th>
            <th style={tableHead}>Vendors</th>
            <th style={tableHead}>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading && <StatusRow text="Loading..." />}
          {!loading && error && <StatusRow text={error} />}
          {!loading && !error && sites.length === 0 && (
            <StatusRow text="No sites yet" />
          )}

          {!loading &&
            !error &&
            pagination.currentData.map((site) => (
              <tr key={site.id}>
                <td style={tableData}>{site.site_name}</td>
                <td style={tableData}>{site.location}</td>
                <td style={tableData}>{site.description}</td>
                <td style={tableData}>Rs. {site.material_cost || 0}</td>
                <td style={tableData}>Rs. {site.total_expense || 0}</td>
                <td style={tableData}>{site.material_count || 0}</td>
                <td style={tableData}>{site.labour_count || 0}</td>
                <td style={tableData}>{site.vendor_count || 0}</td>
                <td style={tableData}>
                  <Link to={`/sites/details/${site.id}`} style={linkStyle}>
                    Site Report
                  </Link>
                  <button
                    type="button"
                    style={actionButtonStyle}
                    onClick={() => handleEdit(site)}
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(site)}>
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
        totalItems={sites.length}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
      />
      <Modal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <ConfirmDialog
          title="Delete site?"
          message={`This will delete ${deleteTarget?.site_name || "this site"} and linked site records.`}
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
      <td style={tableData} colSpan="9">
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

const linkStyle = {
  marginRight: "10px",
  color: "#2563eb",
  fontWeight: "600",
  textDecoration: "none",
};

const actionButtonStyle = {
  marginRight: "10px",
};

export default SiteTable;
