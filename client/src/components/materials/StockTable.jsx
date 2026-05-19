function StockTable() {
  const stocks = [
    {
      material: "Cement",
      received: 500,
      used: 300,
      remaining: 200,
    },
    {
      material: "Steel",
      received: 100,
      used: 40,
      remaining: 60,
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
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
            <th style={tableHead}>Received</th>
            <th style={tableHead}>Used</th>
            <th style={tableHead}>Remaining</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((stock, index) => (
            <tr key={index}>
              <td style={tableData}>{stock.material}</td>
              <td style={tableData}>{stock.received}</td>
              <td style={tableData}>{stock.used}</td>
              <td style={tableData}>{stock.remaining}</td>
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

export default StockTable;