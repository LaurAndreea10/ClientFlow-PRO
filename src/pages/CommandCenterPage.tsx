import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getClients, getTasks } from '../lib/mockApi'
import { readSuiteCollection } from '../lib/suiteStorage'
import { useLanguage } from '../lib/i18n'
import type { Client, Task } from '../types'

export function CommandCenterPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const [clients, setClients] = useState<Client[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    getClients().then(setClients)
    getTasks().then(setTasks)
  }, [])

  const invoices = readSuiteCollection('invoices')
  const bookings = readSuiteCollection('beauty')
  const notifications = readSuiteCollection('notifications')
  const today = new Date().toISOString().slice(0, 10)

  const stats = useMemo(() => {
    const overdue = tasks.filter((task) => !task.archived && task.status !== 'done' && task.dueDate && task.dueDate < today).length
    const openRevenue = invoices.filter((invoice) => invoice.status !== 'paid').reduce((sum, invoice) => sum + invoice.amount, 0)
    const bookingsToday = bookings.filter((booking) => booking.date === today).length
    const clientRisks = clients.filter((client) => (client.healthScore ?? 100) < 70).length
    const unread = notifications.filter((item) => !item.read).length
    return { overdue, openRevenue, bookingsToday, clientRisks, unread }
  }, [bookings, clients, invoices, notifications, tasks, today])

  const actions = [
    { label: ro ? 'Rulează automatizări' : 'Run automations', href: '/automations' },
    { label: ro ? 'Vezi notificări' : 'Review notifications', href: '/notifications' },
    { label: ro ? 'Caută în suită' : 'Search the suite', href: '/search' },
    { label: ro ? 'Deschide facturi' : 'Open invoices', href: '/invoices' },
    { label: ro ? 'Verifică bookings' : 'Check bookings', href: '/beauty' },
  ]

  return (
    <div className="grid">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">{ro ? 'Command Center' : 'Command Center'}</p>
            <h1 className="page-title">{ro ? 'Tot ce contează, într-un singur hub.' : 'Everything important, in one hub.'}</h1>
            <p className="muted" style={{ maxWidth: 720 }}>
              {ro ? 'Priorități, venituri deschise, bookings, riscuri și acțiuni rapide.' : 'Priorities, open revenue, bookings, risks and next actions.'}
            </p>
          </div>
          <div className="kpi-strip">
            <div className="kpi-mini"><div className="small muted">Overdue</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>{stats.overdue}</div></div>
            <div className="kpi-mini"><div className="small muted">Open</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>€{stats.openRevenue}</div></div>
            <div className="kpi-mini"><div className="small muted">Unread</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>{stats.unread}</div></div>
          </div>
        </div>
      </section>

      <section className="grid stats">
        <div className="card card-pad stat-card"><div className="small muted">{ro ? 'Task-uri întârziate' : 'Overdue tasks'}</div><div className="stat-value">{stats.overdue}</div><div className="stat-change">delivery risk</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{ro ? 'Venit deschis' : 'Open revenue'}</div><div className="stat-value">€{stats.openRevenue}</div><div className="stat-change">invoice pipeline</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{ro ? 'Bookings azi' : 'Bookings today'}</div><div className="stat-value">{stats.bookingsToday}</div><div className="stat-change">beauty studio</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{ro ? 'Riscuri clienți' : 'Client risks'}</div><div className="stat-value">{stats.clientRisks}</div><div className="stat-change">health score</div></div>
      </section>

      <section className="card card-pad">
        <div className="card-title-row"><h2 style={{ margin: 0 }}>{ro ? 'Next best actions' : 'Next best actions'}</h2><span className="pill">operational</span></div>
        <div className="suite-roadmap">
          {actions.map((action) => <Link className="note" key={action.href} to={action.href}>→ {action.label}</Link>)}
        </div>
      </section>
    </div>
  )
}
