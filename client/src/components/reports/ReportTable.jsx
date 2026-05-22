function ReportTable({
  title = "Reports List",
  data = [],
  columns = [],
  loading = false,
  error = "",
}) {
  const visibleCount = loading || error ? 0 : data.length;

  return (
    <section className="report-table-card">
      <div className="report-table-header">
        <div>
          <p className="report-table-eyebrow">Report Table</p>
          <h2>{title}</h2>
        </div>
        <span className="report-table-count">
          {visibleCount} {visibleCount === 1 ? "record" : "records"}
        </span>
      </div>

      <div className="report-table-scroll">
        <table className="professional-table report-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={getColumnClass(column)}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {!loading && error && (
              <StateRow
                type="error"
                colSpan={columns.length}
                text={error}
              />
            )}

            {loading && (
              <StateRow
                colSpan={columns.length}
                text="Loading reports..."
              />
            )}

            {!loading && !error && data.length === 0 && (
              <StateRow
                colSpan={columns.length}
                text="No records found"
              />
            )}

            {!loading && data.map((item, index) => (
              <tr key={item.id || index}>
                {columns.map((column) => (
                  <td key={column.key} className={getColumnClass(column)}>
                    {formatCell(item[column.key], column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StateRow({ colSpan, text, type = "empty" }) {
  return (
    <tr>
      <td className={`report-table-state report-table-state-${type}`} colSpan={colSpan}>
        {text}
      </td>
    </tr>
  );
}

function getColumnClass(column) {
  const key = column.key.toLowerCase();
  const label = column.label.toLowerCase();
  const classes = [];

  if (
    key.includes("amount") ||
    key.includes("cost") ||
    key.includes("wage") ||
    key.includes("purchase") ||
    key.includes("paid") ||
    key.includes("pending") ||
    label.includes("cost") ||
    label.includes("paid") ||
    label.includes("pending") ||
    label.includes("total")
  ) {
    classes.push("is-money");
  }

  if (
    key.includes("count") ||
    key.includes("received") ||
    key.includes("used") ||
    key.includes("remaining") ||
    label.includes("attendance") ||
    label.includes("labours")
  ) {
    classes.push("is-number");
  }

  if (
    key.includes("date") ||
    key.includes("_at") ||
    label.includes("date") ||
    label.includes("marked")
  ) {
    classes.push("is-date");
  }

  if (key.includes("status") || label.includes("status")) {
    classes.push("is-status");
  }

  return classes.join(" ");
}

function formatCell(value, column) {
  if (value === null || value === undefined || value === "") {
    return <span className="cell-muted">-</span>;
  }

  const key = column.key.toLowerCase();
  const text = String(value);

  if (key.includes("status")) {
    return <span className="cell-status">{text}</span>;
  }

  if (text.startsWith("Rs.")) {
    return <span className="cell-money">{text}</span>;
  }

  return text;
}

export default ReportTable;
