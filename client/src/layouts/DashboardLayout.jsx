import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        <main
          style={{
            padding: "20px",
            flex: 1,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;