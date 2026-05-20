import { Link, useLocation } from "react-router-dom";

const menuGroups = [
  {
    title: "Workspace",
    items: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Materials", path: "/materials" },
      { name: "Vendors", path: "/vendors" },
      { name: "Labour", path: "/labour" },
      { name: "Finance", path: "/finance" },
      { name: "Sites", path: "/sites" },
    ],
  },
  {
    title: "Reports",
    items: [
      { name: "Material Report", path: "/reports/materials" },
      { name: "Vendor Report", path: "/reports/vendors" },
      { name: "Labour Report", path: "/reports/labours" },
      { name: "Financial Report", path: "/reports/financial" },
      { name: "Site Report", path: "/reports/sites" },
    ],
  },
];

function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation();

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">CM</div>
        <div>
          <h1>ConstructPro</h1>
          <p>Management System</p>
        </div>

        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          x
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuGroups.map((group) => (
          <div className="sidebar-group" key={group.title}>
            <p className="sidebar-group-title">{group.title}</p>
            {group.items.map((menu) => {
              const active = location.pathname === menu.path;

              return (
                <Link
                  key={menu.path}
                  to={menu.path}
                  className={`sidebar-link ${active ? "active" : ""}`}
                  onClick={onClose}
                >
                  <span>{menu.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">A</div>
        <div>
          <h4>Admin</h4>
          <p>Project Control</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
                                     