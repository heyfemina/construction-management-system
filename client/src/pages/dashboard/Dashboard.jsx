// import { useContext, useEffect, useMemo, useState } from "react";
// import {
//   FiActivity,
//   FiArrowUpRight,
//   FiBox,
//   FiBriefcase,
//   FiDollarSign,
//   FiMapPin,
//   FiTrendingUp,
//   FiUsers,
// } from "react-icons/fi";
// import { AuthContext } from "../../context/AuthContext";
// import { getDashboardSummary, getFinanceData } from "../../api/financeApi";
// import { getMaterialActivity } from "../../api/materialApi";
// import ExpenseChart from "../../components/dashboard/ExpenseChart";
// import LabourChart from "../../components/dashboard/LabourChart";
// import MaterialChart from "../../components/dashboard/MaterialChart";

// const defaultSummary = {
//   totalExpenses: 0,
//   pendingReceivables: 0,
//   pendingPayments: 0,
//   pendingVendorPayments: 0,
//   pendingLabourPayments: 0,
//   materialCosts: 0,
//   labourCosts: 0,
//   paidLabourCosts: 0,
//   totalSites: 0,
//   totalVendors: 0,
//   totalWorkers: 0,
//   totalMaterials: 0,
//   monthlyExpenses: [],
//   monthlyMaterials: [],
// };

// function Dashboard() {
//   const { user } = useContext(AuthContext);
//   const [summary, setSummary] = useState(defaultSummary);

//   useEffect(() => {
//     const loadSummary = async () => {
//       try {
//         const [summaryResult, financeResult, materialActivityResult] = await Promise.allSettled([
//           getDashboardSummary(),
//           getFinanceData(),
//           getMaterialActivity(),
//         ]);
//         const nextSummary =
//           summaryResult.status === "fulfilled"
//             ? summaryResult.value.data.summary || defaultSummary
//             : defaultSummary;
//         const finance =
//           financeResult.status === "fulfilled"
//             ? financeResult.value.data || {}
//             : {};
//         const materialActivity =
//           materialActivityResult.status === "fulfilled"
//             ? materialActivityResult.value.data || {}
//             : {};

//         setSummary({
//           ...defaultSummary,
//           ...nextSummary,
//           monthlyExpenses:
//             nextSummary.monthlyExpenses?.length > 0
//               ? nextSummary.monthlyExpenses
//               : buildMonthlySeries(finance.expenses || [], "expense_date", "amount", "expense"),
//           monthlyMaterials:
//             nextSummary.monthlyMaterials?.length > 0
//               ? nextSummary.monthlyMaterials
//               : buildMonthlySeries(
//                   materialActivity.purchases || [],
//                   "purchase_date",
//                   "total_cost",
//                   "materials"
//                 ),
//         });
//       } catch {
//         setSummary(defaultSummary);
//       }
//     };

//     loadSummary();
//   }, []);

//   const completionScore = useMemo(() => {
//     const activeSignals =
//       summary.totalSites +
//       summary.totalVendors +
//       summary.totalWorkers +
//       summary.totalMaterials;

//     return Math.min(100, Math.max(18, activeSignals * 8));
//   }, [summary]);

//   const kpis = [
//     {
//       label: "Total Expenses",
//       value: formatMoney(summary.totalExpenses),
//       detail: "Recorded spend",
//       icon: FiDollarSign,
//       accent: "#2563eb",
//       bg: "#eff6ff",
//     },
//     {
//       label: "Pending Payments",
//       value: formatMoney(summary.pendingPayments),
//       detail: "Vendor and labour dues",
//       icon: FiTrendingUp,
//       accent: "#b45309",
//       bg: "#fffbeb",
//     },
//     {
//       label: "Material Costs",
//       value: formatMoney(summary.materialCosts),
//       detail: "Live purchase total",
//       icon: FiBox,
//       accent: "#059669",
//       bg: "#ecfdf5",
//     },
//     {
//       label: "Labour Costs",
//       value: formatMoney(summary.labourCosts),
//       detail: "Wages recorded",
//       icon: FiUsers,
//       accent: "#be123c",
//       bg: "#fff1f2",
//     },
//   ];

//   const operatingStats = [
//     { label: "Vendors", value: summary.totalVendors, icon: FiBriefcase },
//     { label: "Materials", value: summary.totalMaterials, icon: FiBox },
//     { label: "Sites", value: summary.totalSites, icon: FiMapPin },
//   ];

//   const maxFinancialValue = Math.max(
//     summary.totalExpenses,
//     summary.pendingReceivables,
//     summary.pendingPayments,
//     summary.materialCosts,
//     summary.labourCosts,
//     1
//   );

//   const widthFor = (value) =>
//     `${Math.max(8, Math.round((Number(value || 0) / maxFinancialValue) * 100))}%`;

//   const actionFocus = [
//     {
//       text: `${formatMoney(summary.pendingReceivables)} receivables pending`,
//       tone: "#b45309",
//     },
//     {
//       text: `${formatMoney(summary.pendingVendorPayments)} vendor dues pending`,
//       tone: "#2563eb",
//     },
//     {
//       text: `${formatMoney(summary.pendingLabourPayments)} labour dues pending`,
//       tone: "#059669",
//     },
//   ];

//   return (
//     <div className="dashboard-page" style={pageStyle}>
//       <section className="premium-dashboard-hero" style={heroStyle}>
//         <div>
//           <p style={eyebrowStyle}>Construction Operations</p>
//           <h1 style={titleStyle}>
//             {user?.name ? `Welcome back, ${user.name}` : "Executive Dashboard"}
//           </h1>
//           <p style={subtitleStyle}>
//             Track costs, workforce, materials, vendors, and site progress from one clean workspace.
//           </p>
//         </div>

//         <div style={heroMetricStyle}>
//           <FiActivity size={22} />
//           <div>
//             <span style={heroMetricLabelStyle}>Portfolio Health</span>
//             <strong style={heroMetricValueStyle}>{completionScore}%</strong>
//           </div>
//         </div>
//       </section>

//       <section style={kpiGridStyle}>
//         {kpis.map((item) => (
//           <KpiCard key={item.label} item={item} />
//         ))}
//       </section>

//       <section className="premium-dashboard-main-grid" style={mainGridStyle}>
//         <div style={panelStyle}>
//           <div style={panelHeaderStyle}>
//             <div>
//               <p style={sectionLabelStyle}>Financial Control</p>
//               <h2 style={panelTitleStyle}>Cash Position</h2>
//             </div>
//             <span style={statusPillStyle}>Live</span>
//           </div>

//           <div style={financeRowsStyle}>
//             <MetricRow
//               label="Spend captured"
//               value={formatMoney(summary.totalExpenses)}
//               color="#2563eb"
//               width={widthFor(summary.totalExpenses)}
//             />
//             <MetricRow
//               label="Receivables pending"
//               value={formatMoney(summary.pendingReceivables)}
//               color="#b45309"
//               width={widthFor(summary.pendingReceivables)}
//             />
//             <MetricRow
//               label="Payments pending"
//               value={formatMoney(summary.pendingPayments)}
//               color="#be123c"
//               width={widthFor(summary.pendingPayments)}
//             />
//           </div>

//           <div style={insightBoxStyle}>
//             <FiArrowUpRight size={20} />
//             <p>{`Live totals include ${formatMoney(summary.materialCosts)} material cost and ${formatMoney(summary.labourCosts)} labour cost.`}</p>
//           </div>
//         </div>

//         <div style={panelStyle}>
//           <div style={panelHeaderStyle}>
//             <div>
//               <p style={sectionLabelStyle}>Operating Base</p>
//               <h2 style={panelTitleStyle}>Resources</h2>
//             </div>
//           </div>

//           <div style={resourceGridStyle}>
//             {operatingStats.map((stat) => {
//               const Icon = stat.icon;
//               return (
//                 <div key={stat.label} style={resourceTileStyle}>
//                   <Icon size={20} />
//                   <strong>{stat.value}</strong>
//                   <span>{stat.label}</span>
//                 </div>
//               );
//             })}
//           </div>

//           <div style={progressBlockStyle}>
//             <div style={progressHeaderStyle}>
//               <span>Setup completeness</span>
//               <strong>{completionScore}%</strong>
//             </div>
//             <div style={progressTrackStyle}>
//               <div style={{ ...progressFillStyle, width: `${completionScore}%` }} />
//             </div>
//           </div>
//         </div>

//         <div style={panelStyle}>
//           <div style={panelHeaderStyle}>
//             <div>
//               <p style={sectionLabelStyle}>Today</p>
//               <h2 style={panelTitleStyle}>Action Focus</h2>
//             </div>
//           </div>

//           <div style={taskListStyle}>
//             {actionFocus.map((item) => (
//               <Task key={item.text} text={item.text} tone={item.tone} />
//             ))}
//           </div>
//         </div>
//       </section>

//       <section style={chartGridStyle}>
//         <ExpenseChart data={summary.monthlyExpenses || []} />
//         <MaterialChart data={summary.monthlyMaterials || []} />
//         <LabourChart
//           paid={summary.paidLabourCosts}
//           pending={summary.pendingLabourPayments}
//         />
//       </section>
//     </div>
//   );
// }

// function KpiCard({ item }) {
//   const Icon = item.icon;

//   return (
//     <div
//       className="dashboard-kpi-card"
//       style={{
//         "--kpi-accent": item.accent,
//         "--kpi-soft": item.bg,
//       }}
//     >
//       <div className="dashboard-kpi-icon">
//         <Icon size={22} />
//       </div>
//       <div className="dashboard-kpi-copy">
//         <p>{item.label}</p>
//         <span>{item.detail}</span>
//       </div>
//       <strong className="dashboard-kpi-value">{item.value}</strong>
//     </div>
//   );
// }

// function MetricRow({ label, value, color, width }) {
//   return (
//     <div>
//       <div style={metricHeaderStyle}>
//         <span>{label}</span>
//         <strong>{value}</strong>
//       </div>
//       <div style={metricTrackStyle}>
//         <div style={{ ...metricFillStyle, backgroundColor: color, width }} />
//       </div>
//     </div>
//   );
// }

// function Task({ text, tone }) {
//   return (
//     <div style={taskStyle}>
//       <span style={{ ...taskDotStyle, backgroundColor: tone }} />
//       <span>{text}</span>
//     </div>
//   );
// }

// function formatMoney(value) {
//   return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
// }

// function buildMonthlySeries(rows, dateKey, amountKey, outputKey) {
//   const monthMap = new Map();

//   rows.forEach((row) => {
//     const rawDate = row[dateKey] || row.created_at;
//     const date = rawDate ? new Date(rawDate) : null;

//     if (!date || Number.isNaN(date.getTime())) {
//       return;
//     }

//     const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
//     const label = date.toLocaleDateString("en-IN", {
//       month: "short",
//       year: "numeric",
//     });

//     monthMap.set(key, {
//       month: label,
//       [outputKey]:
//         (monthMap.get(key)?.[outputKey] || 0) + Number(row[amountKey] || 0),
//     });
//   });

//   return Array.from(monthMap.entries())
//     .sort(([a], [b]) => a.localeCompare(b))
//     .map(([, value]) => value);
// }

// const pageStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "24px",
// };

// const heroStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   gap: "24px",
//   alignItems: "stretch",
//   padding: "28px",
//   borderRadius: "8px",
//   background:
//     "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 140%)",
//   color: "#ffffff",
//   boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
// };

// const eyebrowStyle = {
//   margin: "0 0 10px",
//   color: "#a7f3d0",
//   fontSize: "13px",
//   fontWeight: "700",
//   textTransform: "uppercase",
// };

// const titleStyle = {
//   margin: 0,
//   color: "#ffffff",
//   fontSize: "34px",
//   lineHeight: 1.15,
//   fontWeight: "800",
// };

// const subtitleStyle = {
//   maxWidth: "620px",
//   margin: "12px 0 0",
//   color: "#cbd5e1",
//   lineHeight: 1.6,
// };

// const heroMetricStyle = {
//   minWidth: "190px",
//   display: "flex",
//   alignItems: "center",
//   gap: "14px",
//   padding: "18px",
//   borderRadius: "8px",
//   backgroundColor: "rgba(255,255,255,0.1)",
//   border: "1px solid rgba(255,255,255,0.16)",
// };

// const heroMetricLabelStyle = {
//   display: "block",
//   color: "#cbd5e1",
//   fontSize: "13px",
// };

// const heroMetricValueStyle = {
//   display: "block",
//   marginTop: "4px",
//   fontSize: "30px",
// };

// const kpiGridStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//   gap: "18px",
// };

// const mainGridStyle = {
//   display: "grid",
//   gridTemplateColumns: "minmax(320px, 1.25fr) minmax(280px, 0.9fr) minmax(280px, 0.9fr)",
//   gap: "18px",
// };

// const panelStyle = {
//   backgroundColor: "var(--surface)",
//   border: "1px solid var(--border)",
//   borderRadius: "8px",
//   padding: "22px",
//   boxShadow: "var(--shadow-sm)",
// };

// const panelHeaderStyle = {
//   display: "flex",
//   alignItems: "flex-start",
//   justifyContent: "space-between",
//   gap: "16px",
//   marginBottom: "20px",
// };

// const sectionLabelStyle = {
//   margin: "0 0 5px",
//   color: "var(--text-muted)",
//   fontSize: "12px",
//   fontWeight: "800",
//   textTransform: "uppercase",
// };

// const panelTitleStyle = {
//   margin: 0,
//   color: "var(--heading)",
//   fontSize: "21px",
// };

// const statusPillStyle = {
//   padding: "6px 10px",
//   borderRadius: "999px",
//   backgroundColor: "var(--accent-soft)",
//   color: "var(--accent-strong)",
//   fontSize: "12px",
//   fontWeight: "800",
// };

// const financeRowsStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "18px",
// };

// const metricHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   gap: "12px",
//   marginBottom: "8px",
//   color: "var(--text)",
//   fontSize: "14px",
// };

// const metricTrackStyle = {
//   height: "9px",
//   borderRadius: "999px",
//   backgroundColor: "var(--surface-subtle)",
//   overflow: "hidden",
// };

// const metricFillStyle = {
//   height: "100%",
//   borderRadius: "999px",
// };

// const insightBoxStyle = {
//   display: "flex",
//   gap: "12px",
//   alignItems: "flex-start",
//   marginTop: "22px",
//   padding: "14px",
//   borderRadius: "8px",
//   backgroundColor: "var(--surface-subtle)",
//   color: "var(--text)",
//   lineHeight: 1.5,
// };

// const resourceGridStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(3, 1fr)",
//   gap: "10px",
// };

// const resourceTileStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "8px",
//   padding: "14px",
//   borderRadius: "8px",
//   backgroundColor: "var(--surface-subtle)",
//   color: "var(--text)",
// };

// const progressBlockStyle = {
//   marginTop: "22px",
// };

// const progressHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginBottom: "9px",
//   color: "var(--text)",
//   fontSize: "14px",
// };

// const progressTrackStyle = {
//   height: "10px",
//   backgroundColor: "var(--surface-subtle)",
//   borderRadius: "999px",
//   overflow: "hidden",
// };

// const progressFillStyle = {
//   height: "100%",
//   backgroundColor: "#0f766e",
//   borderRadius: "999px",
// };

// const taskListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "12px",
// };

// const taskStyle = {
//   display: "flex",
//   alignItems: "center",
//   gap: "10px",
//   padding: "13px 0",
//   borderBottom: "1px solid var(--border)",
//   color: "var(--text)",
//   fontWeight: "700",
// };

// const taskDotStyle = {
//   width: "10px",
//   height: "10px",
//   borderRadius: "999px",
// };

// const chartGridStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//   gap: "18px",
//   alignItems: "start",
// };

// export default Dashboard;

import { useContext, useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiArrowUpRight,
  FiBox,
  FiBriefcase,
  FiDollarSign,
  FiMapPin,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { getDashboardSummary, getFinanceData } from "../../api/financeApi";
import { getMaterialActivity } from "../../api/materialApi";
import ExpenseChart from "../../components/dashboard/ExpenseChart";
import LabourChart from "../../components/dashboard/LabourChart";
import MaterialChart from "../../components/dashboard/MaterialChart";

const defaultSummary = {
  totalExpenses: 0,
  pendingReceivables: 0,
  pendingPayments: 0,
  pendingVendorPayments: 0,
  pendingLabourPayments: 0,
  materialCosts: 0,
  labourCosts: 0,
  paidLabourCosts: 0,
  totalSites: 0,
  totalVendors: 0,
  totalWorkers: 0,
  totalMaterials: 0,
  monthlyExpenses: [],
  monthlyMaterials: [],
};

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(defaultSummary);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const [summaryResult, financeResult, materialActivityResult] =
          await Promise.allSettled([
            getDashboardSummary(),
            getFinanceData(),
            getMaterialActivity(),
          ]);

        const nextSummary =
          summaryResult.status === "fulfilled"
            ? summaryResult.value.data.summary || defaultSummary
            : defaultSummary;

        const finance =
          financeResult.status === "fulfilled"
            ? financeResult.value.data || {}
            : {};

        const materialActivity =
          materialActivityResult.status === "fulfilled"
            ? materialActivityResult.value.data || {}
            : {};

        setSummary({
          ...defaultSummary,
          ...nextSummary,
          monthlyExpenses:
            nextSummary.monthlyExpenses?.length > 0
              ? nextSummary.monthlyExpenses
              : buildMonthlySeries(
                  finance.expenses || [],
                  "expense_date",
                  "amount",
                  "expense"
                ),
          monthlyMaterials:
            nextSummary.monthlyMaterials?.length > 0
              ? nextSummary.monthlyMaterials
              : buildMonthlySeries(
                  materialActivity.purchases || [],
                  "purchase_date",
                  "total_cost",
                  "materials"
                ),
        });
      } catch {
        setSummary(defaultSummary);
      }
    };

    loadSummary();
  }, []);

  const completionScore = useMemo(() => {
    const activeSignals =
      summary.totalSites +
      summary.totalVendors +
      summary.totalWorkers +
      summary.totalMaterials;

    return Math.min(100, Math.max(18, activeSignals * 8));
  }, [summary]);

  const kpis = [
    {
      label: "Total Expenses",
      value: formatMoney(summary.totalExpenses),
      detail: "Recorded spend",
      icon: FiDollarSign,
      accent: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Pending Payments",
      value: formatMoney(summary.pendingPayments),
      detail: "Vendor and labour dues",
      icon: FiTrendingUp,
      accent: "#b45309",
      bg: "#fffbeb",
    },
    {
      label: "Material Costs",
      value: formatMoney(summary.materialCosts),
      detail: "Live purchase total",
      icon: FiBox,
      accent: "#059669",
      bg: "#ecfdf5",
    },
    {
      label: "Labour Costs",
      value: formatMoney(summary.labourCosts),
      detail: "Wages recorded",
      icon: FiUsers,
      accent: "#be123c",
      bg: "#fff1f2",
    },
  ];

  const operatingStats = [
    { label: "Vendors", value: summary.totalVendors, icon: FiBriefcase },
    { label: "Materials", value: summary.totalMaterials, icon: FiBox },
    { label: "Sites", value: summary.totalSites, icon: FiMapPin },
  ];

  const maxFinancialValue = Math.max(
    summary.totalExpenses,
    summary.pendingReceivables,
    summary.pendingPayments,
    summary.materialCosts,
    summary.labourCosts,
    1
  );

  const widthFor = (value) =>
    `${Math.max(8, Math.round((Number(value || 0) / maxFinancialValue) * 100))}%`;

  const actionFocus = [
    {
      text: `${formatMoney(summary.pendingReceivables)} receivables pending`,
      tone: "#b45309",
    },
    {
      text: `${formatMoney(summary.pendingVendorPayments)} vendor dues pending`,
      tone: "#2563eb",
    },
    {
      text: `${formatMoney(summary.pendingLabourPayments)} labour dues pending`,
      tone: "#059669",
    },
  ];

  return (
    <div className="dashboard-page" style={pageStyle}>
      <style>
        {`
          .premium-dashboard-main-grid {
            display: grid;
            grid-template-columns: minmax(320px, 1.25fr) minmax(280px, 0.9fr) minmax(280px, 0.9fr);
            gap: 18px;
          }

          .dashboard-kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
            align-items: stretch;
          }

          .dashboard-kpi-card {
            width: 100%;
            min-width: 0;
            min-height: 138px;
            display: grid;
            grid-template-columns: 48px minmax(0, 1fr);
            grid-template-rows: auto 1fr auto;
            column-gap: 14px;
            row-gap: 10px;
            padding: 18px;
            border-radius: 8px;
            background-color: var(--surface);
            border: 1px solid var(--border);
            box-shadow: var(--shadow-sm);
            overflow: hidden;
          }

          .dashboard-kpi-icon {
            grid-column: 1;
            grid-row: 1 / span 2;
            width: 48px;
            height: 48px;
            min-width: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            color: var(--kpi-accent);
            background-color: var(--kpi-soft);
          }

          .dashboard-kpi-copy {
            grid-column: 2;
            grid-row: 1;
            min-width: 0;
          }

          .dashboard-kpi-copy p {
            margin: 0;
            color: var(--heading);
            font-size: 15px;
            font-weight: 800;
            line-height: 1.3;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .dashboard-kpi-copy span {
            display: block;
            margin-top: 4px;
            color: var(--text-muted);
            font-size: 12px;
            font-weight: 600;
            line-height: 1.35;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .dashboard-kpi-value {
            grid-column: 1 / -1;
            grid-row: 3;
            display: block;
            width: 100%;
            min-width: 0;
            margin-top: 4px;
            color: var(--heading);
            font-size: clamp(20px, 1.9vw, 28px);
            font-weight: 900;
            line-height: 1.15;
            letter-spacing: -0.04em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .premium-dashboard-chart-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
            align-items: stretch;
          }

          .premium-dashboard-chart-card {
            width: 100%;
            min-width: 0;
            height: auto;
            min-height: unset;
            display: block;
            overflow: hidden;
          }

          .premium-dashboard-chart-card > * {
            width: 100%;
            min-width: 0;
          }

          .premium-dashboard-chart-card canvas,
          .premium-dashboard-chart-card svg {
            max-width: 100%;
            display: block;
          }

          @media (max-width: 1180px) {
            .dashboard-kpi-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .premium-dashboard-main-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .premium-dashboard-main-grid > div:first-child {
              grid-column: 1 / -1;
            }

            .premium-dashboard-chart-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 760px) {
            .premium-dashboard-hero {
              flex-direction: column;
            }

            .premium-dashboard-main-grid {
              grid-template-columns: 1fr;
            }

            .premium-dashboard-chart-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 560px) {
            .dashboard-kpi-grid {
              grid-template-columns: 1fr;
            }

            .dashboard-kpi-card {
              min-height: auto;
            }
          }

          @media (max-width: 520px) {
            .dashboard-page {
              gap: 18px;
            }

            .premium-dashboard-hero {
              padding: 22px !important;
            }

            .dashboard-title-text {
              font-size: 27px !important;
            }
          }
        `}
      </style>

      <section className="premium-dashboard-hero" style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Construction Operations</p>
          <h1 className="dashboard-title-text" style={titleStyle}>
            {user?.name ? `Welcome back, ${user.name}` : "Executive Dashboard"}
          </h1>
          <p style={subtitleStyle}>
            Track costs, workforce, materials, vendors, and site progress from one clean workspace.
          </p>
        </div>

        <div style={heroMetricStyle}>
          <FiActivity size={22} />
          <div>
            <span style={heroMetricLabelStyle}>Portfolio Health</span>
            <strong style={heroMetricValueStyle}>{completionScore}%</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-kpi-grid">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="premium-dashboard-main-grid">
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={sectionLabelStyle}>Financial Control</p>
              <h2 style={panelTitleStyle}>Cash Position</h2>
            </div>
            <span style={statusPillStyle}>Live</span>
          </div>

          <div style={financeRowsStyle}>
            <MetricRow
              label="Spend captured"
              value={formatMoney(summary.totalExpenses)}
              color="#2563eb"
              width={widthFor(summary.totalExpenses)}
            />
            <MetricRow
              label="Receivables pending"
              value={formatMoney(summary.pendingReceivables)}
              color="#b45309"
              width={widthFor(summary.pendingReceivables)}
            />
            <MetricRow
              label="Payments pending"
              value={formatMoney(summary.pendingPayments)}
              color="#be123c"
              width={widthFor(summary.pendingPayments)}
            />
          </div>

          <div style={insightBoxStyle}>
            <FiArrowUpRight size={20} />
            <p style={{ margin: 0 }}>
              {`Live totals include ${formatMoney(
                summary.materialCosts
              )} material cost and ${formatMoney(summary.labourCosts)} labour cost.`}
            </p>
          </div>
        </div>

        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={sectionLabelStyle}>Operating Base</p>
              <h2 style={panelTitleStyle}>Resources</h2>
            </div>
          </div>

          <div style={resourceGridStyle}>
            {operatingStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div key={stat.label} style={resourceTileStyle}>
                  <Icon size={20} />
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              );
            })}
          </div>

          <div style={progressBlockStyle}>
            <div style={progressHeaderStyle}>
              <span>Setup completeness</span>
              <strong>{completionScore}%</strong>
            </div>
            <div style={progressTrackStyle}>
              <div style={{ ...progressFillStyle, width: `${completionScore}%` }} />
            </div>
          </div>
        </div>

        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={sectionLabelStyle}>Today</p>
              <h2 style={panelTitleStyle}>Action Focus</h2>
            </div>
          </div>

          <div style={taskListStyle}>
            {actionFocus.map((item) => (
              <Task key={item.text} text={item.text} tone={item.tone} />
            ))}
          </div>
        </div>
      </section>

      <section className="premium-dashboard-chart-grid">
        <div className="premium-dashboard-chart-card" style={chartCardStyle}>
          <ExpenseChart data={summary.monthlyExpenses || []} />
        </div>

        <div className="premium-dashboard-chart-card" style={chartCardStyle}>
          <MaterialChart data={summary.monthlyMaterials || []} />
        </div>

        <div className="premium-dashboard-chart-card" style={chartCardStyle}>
          <LabourChart
            paid={summary.paidLabourCosts}
            pending={summary.pendingLabourPayments}
          />
        </div>
      </section>
    </div>
  );
}

function KpiCard({ item }) {
  const Icon = item.icon;

  return (
    <div
      className="dashboard-kpi-card"
      style={{
        "--kpi-accent": item.accent,
        "--kpi-soft": item.bg,
      }}
    >
      <div className="dashboard-kpi-icon">
        <Icon size={22} />
      </div>

      <div className="dashboard-kpi-copy">
        <p>{item.label}</p>
        <span>{item.detail}</span>
      </div>

      <strong className="dashboard-kpi-value" title={item.value}>
        {item.value}
      </strong>
    </div>
  );
}

function MetricRow({ label, value, color, width }) {
  return (
    <div>
      <div style={metricHeaderStyle}>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div style={metricTrackStyle}>
        <div style={{ ...metricFillStyle, backgroundColor: color, width }} />
      </div>
    </div>
  );
}

function Task({ text, tone }) {
  return (
    <div style={taskStyle}>
      <span style={{ ...taskDotStyle, backgroundColor: tone }} />
      <span>{text}</span>
    </div>
  );
}

function formatMoney(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function buildMonthlySeries(rows, dateKey, amountKey, outputKey) {
  const monthMap = new Map();

  rows.forEach((row) => {
    const rawDate = row[dateKey] || row.created_at;
    const date = rawDate ? new Date(rawDate) : null;

    if (!date || Number.isNaN(date.getTime())) {
      return;
    }

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    const label = date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });

    monthMap.set(key, {
      month: label,
      [outputKey]:
        (monthMap.get(key)?.[outputKey] || 0) + Number(row[amountKey] || 0),
    });
  });

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);
}

const pageStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const heroStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "24px",
  alignItems: "stretch",
  padding: "28px",
  borderRadius: "8px",
  background:
    "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 140%)",
  color: "#ffffff",
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
};

const eyebrowStyle = {
  margin: "0 0 10px",
  color: "#a7f3d0",
  fontSize: "13px",
  fontWeight: "700",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "34px",
  lineHeight: 1.15,
  fontWeight: "800",
};

const subtitleStyle = {
  maxWidth: "620px",
  margin: "12px 0 0",
  color: "#cbd5e1",
  lineHeight: 1.6,
};

const heroMetricStyle = {
  minWidth: "190px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "18px",
  borderRadius: "8px",
  backgroundColor: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.16)",
};

const heroMetricLabelStyle = {
  display: "block",
  color: "#cbd5e1",
  fontSize: "13px",
};

const heroMetricValueStyle = {
  display: "block",
  marginTop: "4px",
  fontSize: "30px",
};

const panelStyle = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "22px",
  boxShadow: "var(--shadow-sm)",
  minWidth: 0,
};

const panelHeaderStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "20px",
};

const sectionLabelStyle = {
  margin: "0 0 5px",
  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: "800",
  textTransform: "uppercase",
};

const panelTitleStyle = {
  margin: 0,
  color: "var(--heading)",
  fontSize: "21px",
};

const statusPillStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  backgroundColor: "var(--accent-soft)",
  color: "var(--accent-strong)",
  fontSize: "12px",
  fontWeight: "800",
};

const financeRowsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const metricHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "8px",
  color: "var(--text)",
  fontSize: "14px",
};

const metricTrackStyle = {
  height: "9px",
  borderRadius: "999px",
  backgroundColor: "var(--surface-subtle)",
  overflow: "hidden",
};

const metricFillStyle = {
  height: "100%",
  borderRadius: "999px",
};

const insightBoxStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
  marginTop: "22px",
  padding: "14px",
  borderRadius: "8px",
  backgroundColor: "var(--surface-subtle)",
  color: "var(--text)",
  lineHeight: 1.5,
};

const resourceGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "10px",
};

const resourceTileStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "14px",
  borderRadius: "8px",
  backgroundColor: "var(--surface-subtle)",
  color: "var(--text)",
  minWidth: 0,
};

const progressBlockStyle = {
  marginTop: "22px",
};

const progressHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "9px",
  color: "var(--text)",
  fontSize: "14px",
};

const progressTrackStyle = {
  height: "10px",
  backgroundColor: "var(--surface-subtle)",
  borderRadius: "999px",
  overflow: "hidden",
};

const progressFillStyle = {
  height: "100%",
  backgroundColor: "#0f766e",
  borderRadius: "999px",
};

const taskListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const taskStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "13px 0",
  borderBottom: "1px solid var(--border)",
  color: "var(--text)",
  fontWeight: "700",
};

const taskDotStyle = {
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  flexShrink: 0,
};

const chartCardStyle = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "14px",
  boxShadow: "var(--shadow-sm)",
  minWidth: 0,
  height: "fit-content",
};

export default Dashboard;