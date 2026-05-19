// import { Link, useLocation } from "react-router-dom";

// function Sidebar() {
//   const location = useLocation();

//   const menus = [
//     {
//       name: "Dashboard",
//       path: "/dashboard",
//     },
//     {
//       name: "Materials",
//       path: "/materials",
//     },
//     {
//       name: "Vendors",
//       path: "/vendors",
//     },
//     {
//       name: "Labour",
//       path: "/labour",
//     },
//     {
//       name: "Finance",
//       path: "/finance",
//     },
//     {
//       name: "Sites",
//       path: "/sites",
//     },
//   ];

//   return (
//     <div
//       style={{
//         width: "250px",
//         minHeight: "100vh",
//         backgroundColor: "#111827",
//         color: "#ffffff",
//         padding: "20px",
//       }}
//     >
//       <h1
//         style={{
//           fontSize: "28px",
//           fontWeight: "700",
//           marginBottom: "40px",
//         }}
//       >
//         CMS
//       </h1>

//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: "10px",
//         }}
//       >
//         {menus.map((menu, index) => (
//           <Link
//             key={index}
//             to={menu.path}
//             style={{
//               textDecoration: "none",
//               color: "#ffffff",
//               padding: "12px",
//               borderRadius: "8px",
//               backgroundColor:
//                 location.pathname === menu.path
//                   ? "#2563eb"
//                   : "transparent",
//             }}
//           >
//             {menu.name}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;


import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menus = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Materials",
      path: "/materials",
    },
    {
      name: "Vendors",
      path: "/vendors",
    },
    {
      name: "Labour",
      path: "/labour",
    },
    {
      name: "Finance",
      path: "/finance",
    },
    {
      name: "Sites",
      path: "/sites",
    },
  ];

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #1e293b",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: "28px 24px",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          CMS Panel
        </h1>

        <p
          style={{
            marginTop: "6px",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          Construction Management System
        </p>
      </div>

      {/* Navigation */}
      <div
        style={{
          padding: "20px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {menus.map((menu, index) => {
          const active =
            location.pathname === menu.path;

          return (
            <Link
              key={index}
              to={menu.path}
              style={{
                textDecoration: "none",
                color: active
                  ? "#ffffff"
                  : "#cbd5e1",
                backgroundColor: active
                  ? "#1e293b"
                  : "transparent",
                padding: "14px 18px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: active ? "600" : "500",
                border: active
                  ? "1px solid #334155"
                  : "1px solid transparent",
                transition: "0.2s ease",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor =
                    "#111827";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor =
                    "transparent";
                }
              }}
            >
              {menu.name}
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div
        style={{
          marginTop: "auto",
          padding: "20px 24px",
          borderTop: "1px solid #1e293b",
        }}
      >
        <div>
          <h4
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            Femina
          </h4>

          <p
            style={{
              marginTop: "4px",
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            Administrator
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;