import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ExpenseChart({ data = [] }) {
  return (
    <div className="dashboard-chart-panel" style={cardStyle}>
      <div style={headerStyle}>
        <div>
          <p style={labelStyle}>Spend Trend</p>
          <h2 style={titleStyle}>Monthly Expenses</h2>
        </div>
        <span style={pillStyle}>Cost</span>
      </div>

      <div style={chartShellStyle}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              width={48}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-subtle)" }}
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
            />
            <Bar dataKey="expense" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        {data.length === 0 && <p style={emptyStyle}>No expense records yet</p>}
      </div>
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
  marginBottom: "14px",
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

const pillStyle = {
  padding: "5px 9px",
  borderRadius: "999px",
  backgroundColor: "var(--surface-subtle)",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "800",
};

const tooltipStyle = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  color: "var(--text)",
};

const tooltipLabelStyle = {
  color: "var(--heading)",
};

const chartShellStyle = {
  position: "relative",
  flex: 1,
  minHeight: "250px",
};

const emptyStyle = {
  position: "absolute",
  inset: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: 0,
  textAlign: "center",
  color: "var(--text-muted)",
  fontWeight: "700",
  pointerEvents: "none",
};

export default ExpenseChart;
