import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../../lib/mockApi'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/clients', label: 'Clients', icon: '👥' },
  { to: '/tasks', label: 'Tasks', icon: '✅' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

const titles: Record<string, string> = {
  '/dashboard': 'Portfolio dashboard',
  '/clients': 'Client relationships',
  '/tasks': 'Delivery workflow',
  '/settings': 'Profile and workspace settings',
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar desktop-only">
        <Link to="/dashboard" className="brand">
          <span className="brand-mark">CF</span>
          <span>ClientFlow Pro</span>
        </Link>
        <p className="muted small" style={{ marginTop: 10 }}>
          SaaS-style CRM starter with local-first storage and zero required paid services.
        </p>

        <nav className="nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span>{link.icon} {link.label}</span>
              <span className="muted">→</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-panel">
          <div className="small muted">Free-first mode</div>
          <div style={{ marginTop: 8, fontWeight: 700 }}>No backend bill required</div>
          <p className="small muted" style={{ marginTop: 8, marginBottom: 0 }}>
            The current build stores demo auth, clients, tasks and notes directly in the browser.
          </p>
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="button secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main main-with-bottom-nav">
        <div className="mobile-header mobile-only">
          <Link to="/dashboard" className="brand brand-mobile">
            <span className="brand-mark">CF</span>
            <span>ClientFlow Pro</span>
          </Link>
          <button className="button secondary compact-button" onClick={handleLogout}>Log out</button>
        </div>

        <div className="topbar stack-on-mobile">
          <div>
            <div className="small muted">ClientFlow / Workspace</div>
            <h2 className="topbar-title">{titles[location.pathname] ?? 'Workspace'}</h2>
          </div>
          <div className="topbar-actions">
            <div className="pill">📱 Mobile optimized</div>
          </div>
        </div>
        <Outlet />
      </main>

      <nav className="mobile-tabbar mobile-only">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `mobile-tab ${isActive ? 'active' : ''}`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
