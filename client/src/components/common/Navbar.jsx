import { useContext, useMemo, useState } from "react";
import { LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

const searchablePages = [
  {
    title: "Dashboard",
    path: "/dashboard",
    keywords: "home overview kpi analytics",
  },
  {
    title: "Materials",
    path: "/materials",
    keywords: "material inventory purchase usage stock",
  },
  {
    title: "Add Material",
    path: "/materials/add",
    keywords: "new material create material",
  },
  {
    title: "Stock Management",
    path: "/stock-management",
    keywords: "stock inventory quantity material",
  },
  {
    title: "Vendors",
    path: "/vendors",
    keywords: "supplier vendor purchase",
  },
  {
    title: "Add Vendor",
    path: "/vendors/add",
    keywords: "new vendor create supplier",
  },
  {
    title: "Vendor Ledger",
    path: "/vendors/ledger",
    keywords: "vendor payment ledger balance",
  },
  {
    title: "Labour",
    path: "/labour",
    keywords: "worker staff labour",
  },
  {
    title: "Attendance",
    path: "/attendance",
    keywords: "labour attendance present absent",
  },
  {
    title: "Wage Management",
    path: "/wage-management",
    keywords: "salary wages labour payment",
  },
  {
    title: "Labour Ledger",
    path: "/labour-ledger",
    keywords: "labour wage ledger balance",
  },
  {
    title: "Finance",
    path: "/finance",
    keywords: "money accounts finance dashboard",
  },
  {
    title: "Receivables",
    path: "/receivables",
    keywords: "client receive pending amount",
  },
  {
    title: "Expenses",
    path: "/expenses",
    keywords: "expense cost spending",
  },
  {
    title: "Payments",
    path: "/payments",
    keywords: "payment paid transaction",
  },
  {
    title: "Sites",
    path: "/sites",
    keywords: "project site location",
  },
  {
    title: "Add Site",
    path: "/sites/add",
    keywords: "new site create project",
  },
  {
    title: "Material Reports",
    path: "/reports/materials",
    keywords: "material report pdf excel",
  },
  {
    title: "Vendor Reports",
    path: "/reports/vendors",
    keywords: "vendor report supplier",
  },
  {
    title: "Labour Attendance Report",
    path: "/reports/labour-attendance",
    keywords: "labour attendance worker present absent report search",
  },
  {
    title: "Labour Reports",
    path: "/reports/labours",
    keywords: "labour report attendance wage",
  },
  {
    title: "Financial Reports",
    path: "/reports/financial",
    keywords: "finance report financial expense payment",
  },
  {
    title: "Site Reports",
    path: "/reports/sites",
    keywords: "site report project",
  },
];

function Navbar({ onMenuClick }) {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return searchablePages.slice(0, 5);
    }

    return searchablePages
      .map((page) => {
        const haystack = `${page.title} ${page.path} ${page.keywords}`.toLowerCase();
        const title = page.title.toLowerCase();
        const score =
          title === query
            ? 3
            : title.startsWith(query)
              ? 2
              : haystack.includes(query)
                ? 1
                : 0;

        return { ...page, score };
      })
      .filter((page) => page.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 6);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const [firstResult] = searchResults;

    if (!firstResult) {
      return;
    }

    navigate(firstResult.path);
    setSearchQuery("");
    setSearchFocused(false);
  };

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearchQuery("");
    setSearchFocused(false);
  };

  const initial = (user?.name || user?.email || "U")
    .charAt(0)
    .toUpperCase();
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={20} strokeWidth={2.4} />
        </button>
      </div>

      <div className="topbar-actions">
        <form
          className="topbar-search"
          role="search"
          onSubmit={handleSearchSubmit}
        >
          <Search size={16} strokeWidth={2.4} />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => {
              window.setTimeout(() => setSearchFocused(false), 120);
            }}
            placeholder="Search workspace"
            aria-label="Search workspace"
          />

          {searchFocused && (
            <div className="topbar-search-results">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    type="button"
                    key={result.path}
                    className="topbar-search-result"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSearchSelect(result.path)}
                  >
                    <span>{result.title}</span>
                    <small>{result.path}</small>
                  </button>
                ))
              ) : (
                <div className="topbar-search-empty">No matching page</div>
              )}
            </div>
          )}
        </form>

        <div className="topbar-chip">Admin Workspace</div>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun size={18} strokeWidth={2.4} />
          ) : (
            <Moon size={18} strokeWidth={2.4} />
          )}
        </button>

        <button
          type="button"
          className="topbar-user topbar-user-button"
          onClick={() => navigate("/settings")}
          aria-label="Open settings"
        >
          <div className="topbar-avatar">{initial}</div>
          <div className="topbar-user-text">
            <strong>{user?.name || "Admin"}</strong>
            <span>{user?.email || "Signed in"}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="logout-button"
          aria-label="Logout"
        >
          <LogOut size={17} strokeWidth={2.4} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
