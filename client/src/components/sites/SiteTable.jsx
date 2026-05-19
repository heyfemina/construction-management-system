import { useEffect, useState } from "react";
import { deleteSite, getSites } from "../../services/siteService";

function SiteTable() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSites = async () => {
    try {
      setLoading(true);
      const data = await getSites();
      setSites(data.sites || []);
      setError("");
    } catch (err) {
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

  const handleDelete = async (id) => {
    await deleteSite(id);
    loadSites();
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
            sites.map((site) => (
              <tr key={site.id}>
                <td style={tableData}>{site.site_name}</td>
                <td style={tableData}>{site.location}</td>
                <td style={tableData}>{site.description}</td>
                <td style={tableData}>
                  <button type="button" onClick={() => handleDelete(site.id)}>
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

function StatusRow({ text }) {
  return (
    <tr>
      <td style={tableData} colSpan="4">
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

export default SiteTable;
