import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  DollarSign,
  FileText,
  Home,
  MapPin,
  Package,
  Users,
  X,
} from "lucide-react";
import openSoftwareGuidePDF from "../../utils/openSoftwareGuidePDF";

const menuGroups = [
  {
    title: "Workspace",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: Home },
      { name: "Materials", path: "/materials", icon: Package },
      { name: "Vendors", path: "/vendors", icon: Building2 },
      { name: "Labour", path: "/labour", icon: Users },
      { name: "Wage & Payments", path: "/wage-management", icon: CalendarCheck },
      { name: "Finance", path: "/finance", icon: DollarSign },
      { name: "Sites", path: "/sites", icon: MapPin },
    ],
  },
  {
    title: "Reports",
    items: [
      { name: "Material Report", path: "/reports/materials", icon: FileText },
      { name: "Vendor Report", path: "/reports/vendors", icon: FileText },
      { name: "Labour Report", path: "/reports/labours", icon: FileText },
      { name: "Labour Attendance", path: "/reports/labour-attendance", icon: CalendarCheck },
      { name: "Financial Report", path: "/reports/financial", icon: BarChart3 },
      { name: "Site Report", path: "/reports/sites", icon: Briefcase },
    ],
  },
];

function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation();

  const handleOpenGuide = () => {
    openSoftwareGuidePDF();
    onClose?.();
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">CP</div>
        <div className="sidebar-brand-copy">
          <h1>ConstructPro</h1>
          <p>Project Management</p>
        </div>

        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={18} strokeWidth={2.4} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuGroups.map((group) => (
          <div className="sidebar-group" key={group.title}>
            <p className="sidebar-group-title">{group.title}</p>
            {group.items.map((menu) => {
              const active =
                location.pathname === menu.path ||
                location.pathname.startsWith(`${menu.path}/`);
              const Icon = menu.icon;

              return (
                <Link
                  key={menu.path}
                  to={menu.path}
                  className={`sidebar-link ${active ? "active" : ""}`}
                  onClick={onClose}
                >
                  <Icon size={18} strokeWidth={2.2} />
                  <span>{menu.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-guide">
        <button
          type="button"
          className="sidebar-guide-button"
          onClick={handleOpenGuide}
        >
          <BookOpen size={18} strokeWidth={2.2} />
          <span>How to Use</span>
        </button>
      </div>

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
                                     
