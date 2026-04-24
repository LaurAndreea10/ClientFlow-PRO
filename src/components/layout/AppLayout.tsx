import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CommandPalette } from '../CommandPalette'
import { DemoBadge } from '../DemoBadge'
import { DemoTour } from '../DemoTour'
import { LanguageSwitch } from '../LanguageSwitch'
import { PwaStatus } from '../PwaStatus'
import { isDemoSession } from '../../auth/demoAuth'
import { useLanguage, type Language } from '../../lib/i18n'
import { logout, resetDemoWorkspace } from '../../lib/mockApi'

const linkKeys = [
  { to: '/command-center', label: { EN: 'Command Center', RO: 'Command Center' } },
  { to: '/search', label: { EN: 'Search', RO: 'Căutare' } },
  { to: '/automations', label: { EN: 'Automations', RO: 'Automatizări' } },
  { to: '/notifications', label: { EN: 'Notifications', RO: 'Notificări' } },
  { to: '/dashboard', label: { EN: 'Dashboard', RO: 'Dashboard' } },
  { to: '/suite', label: { EN: 'Suite', RO: 'Suită' } },
  { to: '/clients', label: { EN: 'Clients', RO: 'Clienți' } },
  { to: '/tasks', label: { EN: 'Tasks', RO: 'Task-uri' } },
  { to: '/invoices', label: { EN: 'Invoices', RO: 'Facturi' } },
  { to: '/services', label: { EN: 'Services', RO: 'Servicii' } },
  { to: '/time', label: { EN: 'Time', RO: 'Timp' } },
  { to: '/portal', label: { EN: 'Portal', RO: 'Portal' } },
  { to: '/beauty', label: { EN: 'Beauty Studio', RO: 'Beauty Studio' } },
  { to: '/demo-planner', label: { EN: 'Demo Planner', RO: 'Demo Planner' } },
  { to: '/impact', label: { EN: 'Impact', RO: 'Impact' } },
  { to: '/portfolio-score', label: { EN: 'Portfolio Score', RO: 'Scor portofoliu' } },
  { to: '/reports', label: { EN: 'Reports', RO: 'Rapoarte' } },
  { to: '/calendar', label: { EN: 'Calendar', RO: 'Calendar' } },
  { to: '/activity', label: { EN: 'Activity', RO: 'Activitate' } },
  { to: '/case-study', label: { EN: 'Case Study', RO: 'Studiu de caz' } },
  { to: '/settings', label: { EN: 'Settings', RO: 'Setări' } },
] as const

const routeTitles: Record<Language, Record<string, string>> = {
  EN: {
    '/command-center': 'Command Center',
    '/search': 'Global search',
    '/automations': 'Automation rules',
    '/notifications': 'Notifications center',
    '/dashboard': 'Portfolio dashboard',
    '/suite': 'Best-of product suite',
    '/clients': 'Client relationships',
    '/tasks': 'Delivery workflow',
    '/invoices': 'Invoicing and revenue',
    '/services': 'Service templates',
    '/time': 'Time tracking',
    '/portal': 'Client portal preview',
    '/beauty': 'Beauty Studio operations',
    '/demo-planner': 'Demo planner',
    '/impact': 'Impact goals',
    '/portfolio-score': 'Portfolio readiness score',
    '/reports': 'Reports and analytics',
    '/calendar': 'Calendar timeline',
    '/activity': 'Activity log',
    '/case-study': 'Product case study',
    '/settings': 'Workspace settings',
  },
  RO: {
    '/command-center': 'Command Center',
    '/search': 'Căutare globală',
    '/automations': 'Reguli de automatizare',
    '/notifications': 'Centru notificări',
    '/dashboard': 'Dashboard de portofoliu',
    '/suite': 'Suită completă de produs',
    '/clients': 'Relații cu clienții',
    '/tasks': 'Flux de livrare',
    '/invoices': 'Facturi și venituri',
    '/services': 'Template-uri servicii',
    '/time': 'Time tracking',
    '/portal': 'Portal client preview',
    '/beauty': 'Operațiuni Beauty Studio',
    '/demo-planner': 'Demo planner',
    '/impact': 'Obiective de impact',
    '/portfolio-score': 'Scor readiness portofoliu',
    '/reports': 'Rapoarte și analytics',
    '/calendar': 'Calendar',
    '/activity': 'Jurnal de activitate',
    '/case-study': 'Studiu de caz produs',
    '/settings': 'Setări workspace',
  },
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { language, copy } = useLanguage()
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
              <span>{link.label[language]}</span>
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
            <h2 className="topbar-title">{routeTitles[language][location.pathname] ?? 'Workspace'}</h2>
          </div>
          <div className="topbar-actions">
            <LanguageSwitch />
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
