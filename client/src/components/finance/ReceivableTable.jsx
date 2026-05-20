import { useEffect, useState } from "react";
import { getFinanceData } from "../../api/financeApi";
import isConnectionError from "../../utils/isConnectionError";

function ReceivableTable() {
  const [receivables, setReceivables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReceivables = async () => {
    try {
      setLoading(true);
      const response = await getFinanceData();
      setReceivables(response.data.receivables || []);
      setError("");
    } catch (err) {
      if (isConnectionError(err)) {
        setReceivables([]);
        setError("");
        return;
      }

      setError(err.response?.data?.message || "Could not load receivables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceivables();
    window.addEventListener("finance:changed", loadReceivables);

    return () => {
      window.removeEventListener("finance:changed", loadReceivables);
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
        Receivables
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={tableHead}>Client</th>
            <th style={tableHead}>Site</th>
            <th style={tableHead}>Total</th>
            <th style={tableHead}>Received</th>
            <th style={tableHead}>Pending</th>
            <th style={tableHead}>Due Date</th>
          </tr>
        </thead>

        <tbody>
          {loading && <StatusRow text="Loading..." />}
          {!loading && error && <StatusRow text={error} />}
          {!loading && !error && receivables.length === 0 && (
            <StatusRow text="No receivables yet" />
          )}
          {!loading && !error && receivables.map((item) => (
            <tr key={item.id}>
              <td style={tableData}>{item.client_name || "-"}</td>
              <td style={tableData}>{item.site_name || "-"}</td>
              <td style={tableData}>Rs. {item.total_amount}</td>
              <td style={tableData}>Rs. {item.received_amount}</td>
              <td style={tableData}>Rs. {item.pending_amount}</td>
              <td style={tableData}>
                {item.due_date
                  ? new Date(item.due_date).toLocaleDateString()
                  : "-"}
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
      <td style={tableData} colSpan="6">
        {text}
      </td>
    </tr>
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

export default ReceivableTable;
