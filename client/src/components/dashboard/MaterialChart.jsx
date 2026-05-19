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
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
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
  backgroundColor: "#ecfdf5",
  color: "#047857",
  fontSize: "12px",
  fontWeight: "800",
};

export default MaterialChart;
