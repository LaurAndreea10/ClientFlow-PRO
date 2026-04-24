import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CommandPalette } from '../CommandPalette'
import { DemoBadge } from '../DemoBadge'
import { DemoTour } from '../DemoTour'
import { PwaStatus } from '../PwaStatus'
import { isDemoSession } from '../../auth/demoAuth'
import { useLanguage } from '../../lib/i18n'
import { logout, resetDemoWorkspace } from '../../lib/mockApi'

const linkKeys = [
  { to: '/dashboard', key: 'dashboard' },
  { to: '/clients', key: 'clients' },
  { to: '/tasks', key: 'tasks' },
  { to: '/reports', key: 'reports' },
  { to: '/calendar', key: 'calendar' },
  { to: '/activity', key: 'activity' },
  { to: '/settings', key: 'settings' },
] as const

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { copy } = useLanguage()
  const t = copy.layout
  const [resetting, setResetting] = useState(false)
  const demoMode = isDemoSession()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  async function handleResetDemo() {
    if (!demoMode || resetting) return

    setResetting(true)
    await resetDemoWorkspace()
    await queryClient.invalidateQueries()
    setResetting(false)
    navigate('/dashboard')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand">
          <span className="brand-mark">CF</span>
          <span>ClientFlow Pro</span>
        </Link>
        <p className="muted small" style={{ marginTop: 10 }}>
          {t.productIntro}
        </p>

        <nav className="nav" aria-label="Main navigation">
          {linkKeys.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span>{t.links[link.key]}</span>
              <span className="muted">→</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-panel">
          <div className="small muted">{t.commandCenter}</div>
          <div style={{ marginTop: 8, fontWeight: 700 }}>{t.portfolioPolish}</div>
          <div className="list" style={{ marginTop: 12 }}>
            {t.shortcuts.map((shortcut) => (
              <div className="mini-item" key={shortcut.label}>
                <strong>{shortcut.label}</strong>
                <div className="small muted">{shortcut.hint}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-panel">
          <div className="small muted">{t.freeFirstMode}</div>
          <div style={{ marginTop: 8, fontWeight: 700 }}>{t.noBackendBill}</div>
          <p className="small muted" style={{ marginTop: 8, marginBottom: 0 }}>
            {t.localBuild}
          </p>
          {demoMode ? (
            <button className="button secondary" onClick={handleResetDemo} disabled={resetting} style={{ marginTop: 14, width: '100%' }}>
              {resetting ? t.resettingDemo : t.resetDemo}
            </button>
          ) : null}
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="button secondary" onClick={handleLogout}>{t.logout}</button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <div className="small muted">{t.workspace}</div>
            <h2 className="topbar-title">{t.titles[location.pathname as keyof typeof t.titles] ?? 'Workspace'}</h2>
          </div>
          <div className="topbar-actions">
            <PwaStatus />
            <CommandPalette />
            <DemoTour />
            <DemoBadge />
            <Link className="button secondary" to="/tasks">{t.quickAdd}</Link>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
