import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CommandPalette } from '../CommandPalette'
import { DemoBadge } from '../DemoBadge'
import { logout } from '../../lib/mockApi'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/clients', label: 'Clients' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/reports', label: 'Reports' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/activity', label: 'Activity' },
  { to: '/settings', label: 'Settings' },
]

const titles: Record<string, string> = {
  '/dashboard': 'Portfolio dashboard',
  '/clients': 'Client relationships',
  '/tasks': 'Delivery workflow',
  '/reports': 'Reports and analytics',
  '/calendar': 'Calendar timeline',
  '/activity': 'Activity log',
  '/settings': 'Workspace settings',
}

const shortcuts = [
  { label: '⌘K Search', hint: 'Command palette' },
  { label: 'Quick add', hint: 'Create task flow' },
  { label: 'Reports', hint: 'Export CSV / JSON' },
]

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand">
          <span className="brand-mark">CF</span>
          <span>ClientFlow Pro</span>
        </Link>
        <p className="muted small" style={{ marginTop: 10 }}>
          SaaS-style CRM starter with local-first storage, analytics, calendar, activity log and settings.
        </p>

        <nav className="nav" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span>{link.label}</span>
              <span className="muted">→</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-panel">
          <div className="small muted">Command center</div>
          <div style={{ marginTop: 8, fontWeight: 700 }}>Portfolio UX polish</div>
          <div className="list" style={{ marginTop: 12 }}>
            {shortcuts.map((shortcut) => (
              <div className="mini-item" key={shortcut.label}>
                <strong>{shortcut.label}</strong>
                <div className="small muted">{shortcut.hint}</div>
              </div>
            ))}
          </div>
        </div>

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

      <main className="main">
        <div className="topbar">
          <div>
            <div className="small muted">ClientFlow / Workspace</div>
            <h2 className="topbar-title">{titles[location.pathname] ?? 'Workspace'}</h2>
          </div>
          <div className="topbar-actions">
            <CommandPalette />
            <DemoBadge />
            <Link className="button secondary" to="/tasks">Quick add</Link>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
