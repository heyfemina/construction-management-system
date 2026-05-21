import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ExpenseChart() {
  const data = [
    { month: "Jan", expense: 40000 },
    { month: "Feb", expense: 55000 },
    { month: "Mar", expense: 30000 },
    { month: "Apr", expense: 70000 },
  ];

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div>
          <p style={labelStyle}>Spend Trend</p>
          <h2 style={titleStyle}>Monthly Expenses</h2>
        </div>
        <span style={pillStyle}>Cost</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barSize={34}>
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
            cursor={{ fill: "var(--surface-subtle)" }}
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
          />
          <Bar dataKey="expense" fill="#2563eb" radius={[8, 8, 0, 0]} />
        </BarChart>
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

export default ExpenseChart;
