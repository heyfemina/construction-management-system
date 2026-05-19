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
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: "#f8fafc" }} />
          <Bar dataKey="expense" fill="#2563eb" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "22px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
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
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "800",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: 0,
  fontSize: "21px",
  color: "#0f172a",
};

const pillStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "800",
};

export default ExpenseChart;
