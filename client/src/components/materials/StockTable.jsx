import { useEffect, useState } from "react";
import { getMaterials } from "../../api/materialApi";
import isConnectionError from "../../utils/isConnectionError";

function StockTable() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStocks = async () => {
    try {
      setLoading(true);
      const response = await getMaterials();
      setStocks(response.data.materials || []);
      setError("");
    } catch (err) {
      if (isConnectionError(err)) {
        setStocks([]);
        setError("");
        return;
      }

      setError(err.response?.data?.message || "Could not load stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
    window.addEventListener("materials:changed", loadStocks);

    return () => {
      window.removeEventListener("materials:changed", loadStocks);
    };
  }, []);

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
        Material Stock
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={tableHead}>Material</th>
            <th style={tableHead}>Site</th>
            <th style={tableHead}>Received</th>
            <th style={tableHead}>Used</th>
            <th style={tableHead}>Remaining</th>
            <th style={tableHead}>Cost / Unit</th>
            <th style={tableHead}>Transport</th>
            <th style={tableHead}>Cost</th>
          </tr>
        </thead>

        <tbody>
          {loading && <StatusRow text="Loading..." />}
          {!loading && error && <StatusRow text={error} />}
          {!loading && !error && stocks.length === 0 && (
            <StatusRow text="No stock records yet" />
          )}
          {!loading && !error && stocks.map((stock) => (
            <tr key={stock.id}>
              <td style={tableData}>{stock.material_name}</td>
              <td style={tableData}>{stock.site_name || "-"}</td>
              <td style={tableData}>{stock.total_received}</td>
              <td style={tableData}>{stock.total_used}</td>
              <td style={tableData}>{stock.remaining_stock}</td>
              <td style={tableData}>Rs. {formatNumber(stock.avg_unit_cost)}</td>
              <td style={tableData}>Rs. {formatNumber(stock.transport_cost)}</td>
              <td style={tableData}>Rs. {formatNumber(stock.total_cost)}</td>
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
      <td style={tableData} colSpan="8">
        {text}
      </td>
    </tr>
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

export default StockTable;
