import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/materials": "Material Management",
  "/vendors": "Vendor Management",
  "/labour": "Labour Management",
  "/finance": "Finance Management",
  "/sites": "Site Management",
  "/reports/materials": "Material Reports",
  "/reports/vendors": "Vendor Reports",
  "/reports/labours": "Labour Reports",
  "/reports/financial": "Financial Reports",
  "/reports/sites": "Site Reports",
};

function Navbar({ onMenuClick }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initial = (user?.name || user?.email || "U")
    .charAt(0)
    .toUpperCase();
  const pageTitle = pageTitles[location.pathname] || "Workspace";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          menu
        </button>

        <div className="topbar-title-block">
          <div className="topbar-kicker">
            <span className="topbar-status-dot" />
            Construction Management System
          </div>
          <h2>{pageTitle}</h2>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="topbar-chip">Admin Workspace</div>

        <div className="topbar-user">
          <div className="topbar-avatar">{initial}</div>
          <div className="topbar-user-text">
            <strong>{user?.name || "Admin"}</strong>
            <span>{user?.email || "Signed in"}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
