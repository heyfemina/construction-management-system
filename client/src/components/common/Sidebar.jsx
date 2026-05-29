import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  Home,
  MapPin,
  Package,
  Settings,
  Users,
  X,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
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
      { name: "Settings", path: "/settings", icon: Settings },
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

function Sidebar({
  isOpen = false,
  isCollapsed = false,
  onClose,
  onToggleCollapse,
}) {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const userName = user?.name || "Admin";
  const userInitial = (userName || user?.email || "A").charAt(0).toUpperCase();

  const handleOpenGuide = () => {
    openSoftwareGuidePDF();
    onClose?.();
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""} ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">CP</div>
        <div className="sidebar-brand-copy">
          <h1>ConstructPro</h1>
          {/* <p>Project Management</p> */}
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

      <button
        type="button"
        className="sidebar-collapse"
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight size={18} strokeWidth={2.4} />
        ) : (
          <ChevronLeft size={18} strokeWidth={2.4} />
        )}
      </button>

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
                  title={isCollapsed ? menu.name : undefined}
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
          title={isCollapsed ? "How to Use" : undefined}
        >
          <BookOpen size={18} strokeWidth={2.2} />
          <span>How to Use</span>
        </button>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">{userInitial}</div>
        <div>
          <h4>{userName}</h4>
          <p>Project Control</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
                                     
