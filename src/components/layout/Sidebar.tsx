import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/tasks', label: 'Tasks' },
  { to: '/settings', label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo" aria-hidden="true">
          ✓
        </span>
        <span>TaskFlow</span>
      </div>
      <nav aria-label="Primary">
        <ul className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`.trim()}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
