import { useEffect, useState } from "react";
import { deleteMaterial, getMaterials } from "../../services/materialService";

function MaterialTable() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await getMaterials();
      setMaterials(data.materials || []);
      setError("");
    } catch (err) {
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

  const handleDelete = async (id) => {
    await deleteMaterial(id);
    loadMaterials();
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
        Materials List
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={tableHead}>Material Name</th>
            <th style={tableHead}>Unit</th>
            <th style={tableHead}>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td style={tableData} colSpan="3">Loading...</td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td style={tableData} colSpan="3">{error}</td>
            </tr>
          )}

          {!loading && !error && materials.length === 0 && (
            <tr>
              <td style={tableData} colSpan="3">No materials yet</td>
            </tr>
          )}

          {!loading && !error && materials.map((material) => (
            <tr key={material.id}>
              <td style={tableData}>{material.material_name}</td>
              <td style={tableData}>{material.unit}</td>
              <td style={tableData}>
                <button type="button" onClick={() => handleDelete(material.id)}>
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

export default MaterialTable;
