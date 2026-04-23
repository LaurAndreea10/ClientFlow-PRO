import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../../lib/mockApi'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/clients', label: 'Clients' },
  { to: '/tasks', label: 'Tasks' },
]

export function AppLayout() {
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand">ClientFlow Pro</Link>
        <p className="muted small" style={{ marginTop: 8 }}>
          CRM-style portfolio app with zero required paid services.
        </p>

        <nav className="nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 24 }}>
          <button className="button secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}