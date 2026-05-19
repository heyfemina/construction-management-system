import { useEffect, useState } from "react";
import { deleteLabour, getLabours } from "../../services/labourService";

function LabourTable() {
  const [labours, setLabours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLabours = async () => {
    try {
      setLoading(true);
      const data = await getLabours();
      setLabours(data.labours || []);
      setError("");
    } catch (err) {
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

  const handleDelete = async (id) => {
    await deleteLabour(id);
    loadLabours();
  };

  return (
    <div style={tableWrapStyle}>
      <h2 style={headingStyle}>Labour List</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={tableHead}>Name</th>
            <th style={tableHead}>Contact</th>
            <th style={tableHead}>Daily Wage</th>
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
            labours.map((labour) => (
              <tr key={labour.id}>
                <td style={tableData}>{labour.labour_name}</td>
                <td style={tableData}>{labour.contact_number}</td>
                <td style={tableData}>Rs. {labour.daily_wage}</td>
                <td style={tableData}>
                  <button type="button" onClick={() => handleDelete(labour.id)}>
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

export default LabourTable;
