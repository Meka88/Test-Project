import { NavLink, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true, icon: "▦" },
  { to: "/tasks", label: "Tasks", end: false, icon: "☑" },
  { to: "/settings", label: "Settings", end: false, icon: "⚙" },
];

export function Layout() {
  const { settings } = useApp();
  const initials = settings.displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">✦</span>
          <span className="brand-name">Flightdeck</span>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              <span className="nav-icon" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="badge subtle">Meticulous demo</span>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="search">
            <input placeholder="Search tasks, people…" aria-label="Search" />
          </div>
          <div className="user">
            <span className="user-name">{settings.displayName}</span>
            <span className="avatar" aria-hidden>
              {initials}
            </span>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
