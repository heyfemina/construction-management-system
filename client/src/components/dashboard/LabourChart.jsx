import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function LabourChart() {
  const data = [
    { name: "Paid", value: 70000, color: "#059669" },
    { name: "Pending", value: 25000, color: "#be123c" },
  ];

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div>
          <p style={labelStyle}>Workforce Finance</p>
          <h2 style={titleStyle}>Labour Payment Status</h2>
        </div>
      </div>

      <div className="premium-labour-chart-content" style={contentStyle}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={64}
              outerRadius={100}
              paddingAngle={4}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

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
  marginBottom: "10px",
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

const contentStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(240px, 1fr) minmax(220px, 0.7fr)",
  gap: "18px",
  alignItems: "center",
};

const legendStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const legendItemStyle = {
  display: "grid",
  gridTemplateColumns: "12px 1fr auto",
  gap: "10px",
  alignItems: "center",
  padding: "14px",
  borderRadius: "8px",
  backgroundColor: "#f8fafc",
  color: "#334155",
};

const dotStyle = {
  width: "10px",
  height: "10px",
  borderRadius: "999px",
};

export default LabourChart;
