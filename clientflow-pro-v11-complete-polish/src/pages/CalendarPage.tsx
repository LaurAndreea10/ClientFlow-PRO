import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getClients, getNotes, getTasks } from '../lib/mockApi'

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDayLabel(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

function formatRelative(dateString: string) {
  const today = startOfToday()
  const date = new Date(dateString)
  const diffMs = date.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays > 1) return `In ${diffDays} days`
  return `${Math.abs(diffDays)} days ago`
}

function getIntensityLabel(count: number) {
  if (count >= 4) return 'Busy'
  if (count >= 2) return 'Balanced'
  return 'Light'
}

export function CalendarPage() {
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })
  const { data: notes = [] } = useQuery({
    queryKey: ['calendar-notes', clients.map((item) => item.id).join(',')],
    enabled: clients.length > 0,
    queryFn: async () => {
      const chunks = await Promise.all(clients.map((client) => getNotes(client.id)))
      return chunks.flat()
    },
  })

  const clientMap = useMemo(() => {
    return Object.fromEntries(clients.map((client) => [client.id, client]))
  }, [clients])

  const upcomingTasks = useMemo(() => {
    const today = startOfToday()
    return [...tasks]
      .filter((task) => new Date(task.dueDate).getTime() >= today.getTime())
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 6)
  }, [tasks])

  const recentNotes = useMemo(() => {
    return [...notes]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
  }, [notes])

  const weekPlan = useMemo(() => {
    const today = startOfToday()
    const days = Array.from({ length: 7 }, (_, index) => {
      const current = new Date(today)
      current.setDate(today.getDate() + index)
      current.setHours(0, 0, 0, 0)
      const next = new Date(current)
      next.setDate(current.getDate() + 1)
      const items = tasks.filter((task) => {
        const due = new Date(task.dueDate)
        return due >= current && due < next
      })
      return {
        key: current.toISOString(),
        label: current.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        }),
        count: items.length,
        items: items.slice(0, 3),
      }
    })
    return days
  }, [tasks])

  const stats = useMemo(() => {
    const today = startOfToday()
    const dueThisWeek = tasks.filter((task) => {
      const due = new Date(task.dueDate)
      const end = new Date(today)
      end.setDate(today.getDate() + 7)
      return due >= today && due < end
    }).length

    const overdue = tasks.filter((task) => task.status !== 'done' && new Date(task.dueDate) < today).length
    const meetingsLogged = notes.length
    const followUps = tasks.filter((task) => task.priority === 'high' && task.status !== 'done').length
    return { dueThisWeek, overdue, meetingsLogged, followUps }
  }, [tasks, notes])

  return (
    <div className="grid page-gap-lg">
      <div className="page-header stack-on-mobile">
        <div>
          <p className="eyebrow">Calendar & timeline</p>
          <h1 className="page-title">Calendar</h1>
          <p className="muted">Track upcoming deadlines and client notes in a mobile-friendly timeline view, still using only local demo data.</p>
        </div>
        <div className="page-header-actions mobile-full">
          <div className="pill">🗓️ Weekly planning</div>
          <div className="pill">📝 Notes timeline</div>
        </div>
      </div>

      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Delivery visibility</p>
            <h2 className="page-title" style={{ fontSize: '2rem' }}>See what is due next and what happened with clients recently.</h2>
            <p className="muted" style={{ maxWidth: 620 }}>
              This screen strengthens the product story for recruiters: planning, prioritization, recent activity and clear timeline tracking.
            </p>
          </div>
          <div className="kpi-strip">
            <div className="kpi-mini">
              <div className="small muted">Due this week</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>{stats.dueThisWeek}</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Overdue</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>{stats.overdue}</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Meeting notes</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>{stats.meetingsLogged}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid stats">
        <div className="card card-pad stat-card">
          <div className="small muted">High-priority follow-ups</div>
          <div className="stat-value">{stats.followUps}</div>
          <div className="small muted">Open tasks still needing attention</div>
        </div>
        <div className="card card-pad stat-card">
          <div className="small muted">Upcoming deadlines</div>
          <div className="stat-value">{upcomingTasks.length}</div>
          <div className="small muted">Shown in the next-deadlines list</div>
        </div>
        <div className="card card-pad stat-card">
          <div className="small muted">Active clients in plan</div>
          <div className="stat-value">{clients.filter((client) => client.status === 'active').length}</div>
          <div className="small muted">Accounts with highest delivery relevance</div>
        </div>
        <div className="card card-pad stat-card">
          <div className="small muted">Timeline entries</div>
          <div className="stat-value">{recentNotes.length}</div>
          <div className="small muted">Recent client-facing updates and notes</div>
        </div>
      </section>

      <div className="two-col two-col-equal calendar-two-col">
        <section className="card card-pad">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>This week</h2>
              <div className="small muted">A mobile-first weekly plan based on task due dates.</div>
            </div>
            <div className="pill">📱 Touch-friendly</div>
          </div>

          <div className="week-grid">
            {weekPlan.map((day) => (
              <article key={day.key} className="week-card">
                <div className="mobile-list-row">
                  <strong>{day.label}</strong>
                  <span className="pill small-pill">{getIntensityLabel(day.count)}</span>
                </div>
                <div className="small muted" style={{ marginTop: 8 }}>{day.count} task{day.count === 1 ? '' : 's'} planned</div>
                <div className="mini-stack" style={{ marginTop: 12 }}>
                  {day.items.length ? day.items.map((task) => (
                    <div key={task.id} className="mini-chip">
                      <span>{task.title}</span>
                      <span className={`badge ${task.priority}`}>{task.priority}</span>
                    </div>
                  )) : <div className="small muted">No deadlines</div>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card card-pad">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>Upcoming deadlines</h2>
              <div className="small muted">Sorted by nearest due date so you can show planning discipline.</div>
            </div>
            <div className="pill">⏳ Focus list</div>
          </div>

          <div className="mobile-card-list compact-card-list">
            {upcomingTasks.length ? upcomingTasks.map((task) => {
              const client = task.clientId ? clientMap[task.clientId] : null
              return (
                <article key={task.id} className="mobile-list-card">
                  <div className="mobile-list-row">
                    <strong>{task.title}</strong>
                    <span className={`badge ${task.status}`}>{task.status.replace('_', ' ')}</span>
                  </div>
                  <div className="small muted" style={{ marginTop: 8 }}>
                    {client ? `${client.company} · ${client.name}` : 'Internal task'}
                  </div>
                  <div className="mobile-list-row" style={{ marginTop: 12 }}>
                    <span className="pill small-pill">{formatDayLabel(task.dueDate)}</span>
                    <span className="pill small-pill">{formatRelative(task.dueDate)}</span>
                    <span className={`badge ${task.priority}`}>{task.priority}</span>
                  </div>
                </article>
              )
            }) : <div className="empty-state">No upcoming deadlines yet.</div>}
          </div>
        </section>
      </div>

      <div className="two-col calendar-two-col">
        <section className="card card-pad">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>Client activity timeline</h2>
              <div className="small muted">Recent notes help the app feel more like a real operations workspace.</div>
            </div>
            <div className="pill">📝 Timeline</div>
          </div>

          <div className="timeline-list">
            {recentNotes.length ? recentNotes.map((note) => {
              const client = clientMap[note.clientId]
              return (
                <article key={note.id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="mobile-list-row">
                      <strong>{client ? client.company : 'Client note'}</strong>
                      <span className="pill small-pill">{formatDayLabel(note.createdAt)}</span>
                    </div>
                    <div className="small muted" style={{ marginTop: 6 }}>
                      {client ? client.name : 'Unknown client'} · {formatRelative(note.createdAt)}
                    </div>
                    <p style={{ margin: '10px 0 0' }}>{note.content}</p>
                  </div>
                </article>
              )
            }) : <div className="empty-state">No notes have been added yet.</div>}
          </div>
        </section>

        <section className="grid">
          <div className="card card-pad">
            <div className="card-title-row stack-on-mobile">
              <div>
                <h2 style={{ margin: 0 }}>Why this helps your portfolio</h2>
                <div className="small muted">Talking points for README or interviews.</div>
              </div>
            </div>
            <div className="mobile-card-list compact-card-list">
              <article className="mobile-list-card">
                <div className="mobile-list-row"><strong>Planning UX</strong><span className="pill small-pill">Added</span></div>
                <div className="small muted" style={{ marginTop: 8 }}>Shows a weekly plan and deadline visibility instead of only CRUD screens.</div>
              </article>
              <article className="mobile-list-card">
                <div className="mobile-list-row"><strong>Client timeline</strong><span className="pill small-pill">Ready</span></div>
                <div className="small muted" style={{ marginTop: 8 }}>Combines client notes and delivery context in a format that feels product-oriented.</div>
              </article>
              <article className="mobile-list-card">
                <div className="mobile-list-row"><strong>Cost model</strong><span className="pill small-pill">€0 required</span></div>
                <div className="small muted" style={{ marginTop: 8 }}>Everything still runs locally with browser storage and no paid calendar service.</div>
              </article>
            </div>
          </div>

          <div className="card card-pad">
            <div className="card-title-row stack-on-mobile">
              <div>
                <h2 style={{ margin: 0 }}>Suggested README screenshots</h2>
                <div className="small muted">A stronger set of visuals for GitHub.</div>
              </div>
            </div>
            <div className="list compact-list">
              <div className="list-card">1. Dashboard hero with KPI cards</div>
              <div className="list-card">2. Clients view with search and filters</div>
              <div className="list-card">3. Reports page with charts</div>
              <div className="list-card">4. Calendar page with weekly plan</div>
              <div className="list-card">5. Settings page with export/reset actions</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
