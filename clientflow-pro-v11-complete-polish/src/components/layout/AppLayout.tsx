import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { logout, getClients, getTasks, getNotifications, getSession, markAllNotificationsRead } from '../../lib/mockApi'
import { useTheme } from '../../features/theme/ThemeContext'
import { useLocale } from '../../features/locale/LocaleContext'
import { SearchOverlay } from './SearchOverlay'
import { NotificationPanel } from './NotificationPanel'
import { OnboardingModal } from './OnboardingModal'
import { hasSeenOnboarding, markOnboardingSeen } from '../../lib/uiState'

type DeferredPrompt = Event & { prompt: () => Promise<void> }

const titles: Record<string, string> = {
  '/dashboard': 'Portfolio dashboard',
  '/clients': 'Client relationships',
  '/tasks': 'Delivery workflow',
  '/reports': 'Analytics and reporting',
  '/calendar': 'Calendar and timeline',
  '/activity': 'Workspace activity',
  '/settings': 'Profile and workspace settings',
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { theme, toggleTheme } = useTheme()
  const { locale, setLocale, t } = useLocale()
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<DeferredPrompt | null>(null)
  const session = useMemo(() => getSession(), [])
  const [onboardingOpen, setOnboardingOpen] = useState(() => session ? !hasSeenOnboarding(session.id) : false)

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as DeferredPrompt)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const isTyping = tag === 'input' || tag === 'textarea' || target?.isContentEditable
      if (!isTyping && event.key === '/') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setNotificationsOpen(false)
      }
      if (!isTyping && event.key.toLowerCase() === 'g') {
        const next = (route: string) => () => navigate(route)
        const listener = (inner: KeyboardEvent) => {
          const map: Record<string, string> = { d: '/dashboard', c: '/clients', t: '/tasks', r: '/reports', a: '/activity', s: '/settings' }
          const route = map[inner.key.toLowerCase()]
          if (route) navigate(route)
          window.removeEventListener('keydown', listener)
        }
        window.addEventListener('keydown', listener, { once: true })
        window.setTimeout(() => window.removeEventListener('keydown', listener), 1200)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])

  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })
  const { data: notifications = [] } = useQuery({ queryKey: ['notifications'], queryFn: getNotifications })

  const unreadCount = notifications.filter((item) => !item.read).length

  const links = [
    { to: '/dashboard', label: t('navDashboard'), icon: '🏠' },
    { to: '/clients', label: t('navClients'), icon: '👥' },
    { to: '/tasks', label: t('navTasks'), icon: '✅' },
    { to: '/reports', label: t('navReports'), icon: '📈' },
    { to: '/calendar', label: t('navCalendar'), icon: '🗓️' },
    { to: '/activity', label: t('navActivity'), icon: '🧾' },
    { to: '/settings', label: t('navSettings'), icon: '⚙️' },
  ]

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  async function handleInstall() {
    if (!installPrompt) return
    await installPrompt.prompt()
    setInstallPrompt(null)
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead()
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  function closeOnboarding() {
    if (session) markOnboardingSeen(session.id)
    setOnboardingOpen(false)
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

        <nav className="nav" aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span>{link.icon} {link.label}</span>
              <span className="muted">→</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-panel">
          <div className="small muted">Free-first mode</div>
          <div style={{ marginTop: 8, fontWeight: 700 }}>No backend bill required</div>
          <p className="small muted" style={{ marginTop: 8, marginBottom: 0 }}>
            The current build stores auth, clients, tasks, activity and notes directly in the browser.
          </p>
        </div>

        <div className="toolbar wrap-row" style={{ marginTop: 16 }}>
          <button className="button secondary" type="button" onClick={() => setSearchOpen(true)}>{t('search')}</button>
          <button className="button secondary" type="button" onClick={() => setOnboardingOpen(true)}>Demo tour</button>
          {installPrompt ? <button className="button secondary" type="button" onClick={handleInstall}>{t('installApp')}</button> : null}
          <button className="button secondary" onClick={handleLogout}>{t('logOut')}</button>
        </div>
      </aside>

      <main className="main main-with-bottom-nav">
        <div className="mobile-header mobile-only">
          <Link to="/dashboard" className="brand brand-mobile">
            <span className="brand-mark">CF</span>
            <span>ClientFlow Pro</span>
          </Link>
          <div className="toolbar compact-toolbar">
            <button className="button secondary compact-button" onClick={() => setSearchOpen(true)} type="button" aria-label={t('search')}>⌘</button>
            <button className="button secondary compact-button" onClick={() => setNotificationsOpen((current) => !current)} type="button" aria-label={t('notifications')}>🔔{unreadCount ? ` ${unreadCount}` : ''}</button>
          </div>
        </div>

        <div className="topbar stack-on-mobile">
          <div>
            <div className="small muted">ClientFlow / Workspace</div>
            <h2 className="topbar-title">{titles[location.pathname] ?? 'Workspace'}</h2>
            <div className="small muted shortcut-hint">Shortcuts: / search • g then d/c/t/r/a/s navigate</div>
          </div>
          <div className="topbar-actions">
            <div className="toolbar compact-toolbar wrap-row">
              <div className="pill">📱 {t('mobileOptimized')}</div>
              <button className="button secondary compact-button" onClick={() => setSearchOpen(true)} type="button">{t('search')}</button>
              <button className="button secondary compact-button" onClick={() => setOnboardingOpen(true)} type="button">Tour</button>
              <button className="button secondary compact-button" onClick={() => setNotificationsOpen((current) => !current)} type="button">🔔 {unreadCount}</button>
              <button className="button secondary compact-button" onClick={toggleTheme} type="button">{theme === 'dark' ? '☀️' : '🌙'}</button>
              <select className="select compact-control" value={locale} onChange={(e) => setLocale(e.target.value as typeof locale)} aria-label={t('language')}>
                <option value="en">EN</option>
                <option value="ro">RO</option>
              </select>
            </div>
          </div>
        </div>

        <div className="layout-popovers">
          <NotificationPanel open={notificationsOpen} items={notifications} onClose={() => setNotificationsOpen(false)} onMarkAllRead={handleMarkAllRead} />
        </div>
        <Outlet />
      </main>

      <nav className="mobile-tabbar mobile-only" aria-label="Mobile navigation">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `mobile-tab ${isActive ? 'active' : ''}`}>
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <SearchOverlay open={searchOpen} query={search} onClose={() => setSearchOpen(false)} onQueryChange={setSearch} clients={clients} tasks={tasks} />
      <OnboardingModal open={onboardingOpen} onClose={closeOnboarding} />
    </div>
  )
}
