import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function LabourChart({ paid = 0, pending = 0 }) {
  const data = [
    { name: "Paid", value: Number(paid || 0), color: "#059669" },
    { name: "Pending", value: Number(pending || 0), color: "#be123c" },
  ];
  const hasData = data.some((item) => item.value > 0);
  const chartData = hasData
    ? data
    : [{ name: "No payment data", value: 1, color: "var(--surface-subtle)" }];

  return (
    <div className="dashboard-chart-panel" style={cardStyle}>
      <div style={headerStyle}>
        <div>
          <p style={labelStyle}>Workforce Finance</p>
          <h2 style={titleStyle}>Labour Payment Status</h2>
        </div>
      </div>

      <div className="premium-labour-chart-content" style={contentStyle}>
        <div style={pieShellStyle}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={pieChartMargin}>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius="54%"
                outerRadius="78%"
                paddingAngle={4}
                isAnimationActive={hasData}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              {hasData && <Tooltip content={<LabourTooltip />} />}
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={legendStyle}>
          {data.map((item) => (
            <div key={item.name} style={legendItemStyle}>
              <span style={{ ...dotStyle, backgroundColor: item.color }} />
              <span>{item.name}</span>
              <strong>Rs. {item.value.toLocaleString("en-IN")}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LabourTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div style={tooltipStyle}>
      <p style={tooltipLabelStyle}>{item.name}</p>
      <strong style={tooltipValueStyle}>
        Rs. {Number(item.value || 0).toLocaleString("en-IN")}
      </strong>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "var(--surface)",
  padding: "22px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  boxShadow: "var(--shadow-sm)",
  height: "100%",
  minHeight: "380px",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "14px",
  marginBottom: "10px",
};

const labelStyle = {
  margin: "0 0 5px",
  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: "800",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: 0,
  fontSize: "21px",
  color: "var(--heading)",
};

const contentStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gridTemplateRows: "minmax(0, 1fr) auto",
  gap: "14px",
  alignItems: "center",
  flex: 1,
  minHeight: "250px",
};

const pieShellStyle = {
  width: "100%",
  minWidth: 0,
  minHeight: "190px",
  height: "100%",
};

const pieChartMargin = {
  top: 8,
  right: 8,
  bottom: 8,
  left: 8,
};

const legendStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const legendItemStyle = {
  display: "grid",
  gridTemplateColumns: "12px 1fr auto",
  gap: "10px",
  alignItems: "center",
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: "var(--surface-subtle)",
  color: "var(--text)",
};

const dotStyle = {
  width: "10px",
  height: "10px",
  borderRadius: "999px",
};

const tooltipStyle = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  color: "var(--text)",
  padding: "10px 12px",
  boxShadow: "var(--shadow-sm)",
};

const tooltipLabelStyle = {
  margin: "0 0 4px",
  color: "var(--heading)",
  fontWeight: "800",
};

const tooltipValueStyle = {
  color: "var(--text)",
  fontWeight: "850",
};

export default LabourChart;
