import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MaterialChart({ data = [] }) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div>
          <p style={labelStyle}>Material Flow</p>
          <h2 style={titleStyle}>Material Cost</h2>
        </div>
        <span style={pillStyle}>Inventory</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--text-muted)" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--text-muted)" }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
          />
          <Line
            type="monotone"
            dataKey="materials"
            stroke="#059669"
            strokeWidth={3}
            dot={{ r: 4, fill: "#059669", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      {data.length === 0 && <p style={emptyStyle}>No material purchases yet</p>}
    </div>
  );
}

const cardStyle = {
  backgroundColor: "var(--surface)",
  padding: "22px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  boxShadow: "var(--shadow-sm)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "14px",
  marginBottom: "18px",
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
  padding: "6px 10px",
  borderRadius: "999px",
  backgroundColor: "var(--accent-soft)",
  color: "var(--accent-strong)",
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

const emptyStyle = {
  margin: "-155px 0 130px",
  textAlign: "center",
  color: "var(--text-muted)",
  fontWeight: "700",
};

export default MaterialChart;
