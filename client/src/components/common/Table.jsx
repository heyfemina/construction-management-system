function Table({ columns, data }) {
  return (
    <div
      style={{
        overflowX: "auto",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        padding: "10px",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                style={{
                  textAlign: "left",
                  padding: "12px",
                  borderBottom: "1px solid #e5e7eb",
                  backgroundColor: "#f3f4f6",
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((item, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;