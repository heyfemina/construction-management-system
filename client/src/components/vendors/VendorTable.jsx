import { useEffect, useState } from "react";
import { deleteVendor, getVendors } from "../../services/vendorService";

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
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Vendor List
      </h2>

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
            <th style={tableHead}>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td style={tableData} colSpan="4">Loading...</td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td style={tableData} colSpan="4">{error}</td>
            </tr>
          )}

          {!loading && !error && vendors.length === 0 && (
            <tr>
              <td style={tableData} colSpan="4">No vendors yet</td>
            </tr>
          )}

          {!loading && !error && vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td style={tableData}>{vendor.vendor_name}</td>
              <td style={tableData}>{vendor.contact_number}</td>
              <td style={tableData}>{vendor.email}</td>
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
