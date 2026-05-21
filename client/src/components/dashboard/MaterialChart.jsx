import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MaterialChart() {
  const data = [
    { month: "Jan", materials: 20000 },
    { month: "Feb", materials: 35000 },
    { month: "Mar", materials: 28000 },
    { month: "Apr", materials: 50000 },
  ];

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

export default MaterialChart;
