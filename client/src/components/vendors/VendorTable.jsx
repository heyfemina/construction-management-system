import { useEffect, useState } from "react";
import { deleteVendor, getVendors } from "../../services/vendorService";
import ExcelExport from "../reports/ExcelExport";
import PDFExport from "../reports/PDFExport";
import isConnectionError from "../../utils/isConnectionError";

function VendorTable() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleDelete = async (id) => {
    await deleteVendor(id);
    loadVendors();
  };

  const exportColumns = [
    { key: "vendor_name", label: "Vendor Name" },
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
              <td style={tableData} colSpan="7">Loading...</td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td style={tableData} colSpan="7">{error}</td>
            </tr>
          )}

          {!loading && !error && vendors.length === 0 && (
            <tr>
              <td style={tableData} colSpan="7">No vendors yet</td>
            </tr>
          )}

          {!loading && !error && vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td style={tableData}>{vendor.vendor_name}</td>
              <td style={tableData}>{vendor.contact_number}</td>
              <td style={tableData}>{vendor.email}</td>
              <td style={tableData}>Rs. {vendor.total_purchase || 0}</td>
              <td style={tableData}>Rs. {vendor.paid_amount || 0}</td>
              <td style={tableData}>Rs. {vendor.pending_amount || 0}</td>
              <td style={tableData}>
                <button type="button" onClick={() => handleDelete(vendor.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default VendorTable;
