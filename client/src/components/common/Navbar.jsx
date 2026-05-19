import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
        }}
      >
        Construction Management System
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "700",
          }}
        >
          {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            padding: "10px 14px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
