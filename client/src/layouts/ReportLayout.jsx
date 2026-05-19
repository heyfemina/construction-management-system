import Navbar from "../components/common/Navbar";

function ReportLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      <Navbar />

      <div
        style={{
          padding: "30px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default ReportLayout;