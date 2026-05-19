function ReceivableTable() {
  const data = [
    {
      client: "ABC Builders",
      amount: 50000,
      received: 20000,
      pending: 30000,
    },
    {
      client: "XYZ Group",
      amount: 70000,
      received: 50000,
      pending: 20000,
    },
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
            <th style={tableHead}>Total</th>
            <th style={tableHead}>Received</th>
            <th style={tableHead}>Pending</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={tableData}>{item.client}</td>
              <td style={tableData}>₹ {item.amount}</td>
              <td style={tableData}>₹ {item.received}</td>
              <td style={tableData}>₹ {item.pending}</td>
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

export default ReceivableTable;