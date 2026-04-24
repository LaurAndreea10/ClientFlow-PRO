import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getClients, getTasks } from '../lib/mockApi'

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function CalendarPage() {
  const [view, setView] = useState<'week' | 'month'>('week')
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })

  const today = new Date()
  const days = useMemo(() => {
    const length = view === 'week' ? 7 : 30
    return Array.from({ length }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index)
      return date
    })
  }, [view])

  const clientMap = new Map(clients.map((client) => [client.id, client.name]))
  const overdueTasks = tasks.filter((task) => task.dueDate && task.dueDate < formatDate(today) && task.status !== 'done')
  const todayTasks = tasks.filter((task) => task.dueDate === formatDate(today))

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Timeline</p>
          <h1 className="page-title">Calendar</h1>
          <p className="muted">A lightweight local calendar for deadlines, reminders and workload planning.</p>
        </div>
        <div className="toolbar">
          <button className={`button ${view === 'week' ? '' : 'secondary'}`} onClick={() => setView('week')}>Week</button>
          <button className={`button ${view === 'month' ? '' : 'secondary'}`} onClick={() => setView('month')}>Month</button>
        </div>
      </div>

      <section className="grid stats">
        <div className="card card-pad stat-card">
          <div className="small muted">Due today</div>
          <div className="stat-value">{todayTasks.length}</div>
          <div className="stat-change">Smart widget</div>
        </div>
        <div className="card card-pad stat-card">
          <div className="small muted">Overdue</div>
          <div className="stat-value">{overdueTasks.length}</div>
          <div className="stat-change">Needs attention</div>
        </div>
        <div className="card card-pad stat-card">
          <div className="small muted">Upcoming</div>
          <div className="stat-value">{tasks.filter((task) => task.dueDate >= formatDate(today)).length}</div>
          <div className="stat-change">Next {view}</div>
        </div>
        <div className="card card-pad stat-card">
          <div className="small muted">Reminder mode</div>
          <div className="stat-value" style={{ fontSize: '1.7rem' }}>Local</div>
          <div className="stat-change">No backend needed</div>
        </div>
      </section>

      <section className="card card-pad">
        <div className="card-title-row">
          <div>
            <h2 style={{ margin: 0 }}>{view === 'week' ? 'Week timeline' : 'Month timeline'}</h2>
            <div className="small muted">Deadlines grouped by date. Drag-and-drop can be upgraded from this structure.</div>
          </div>
          <div className="pill">{tasks.length} tasks</div>
        </div>

        <div className="calendar-grid">
          {days.map((date) => {
            const key = formatDate(date)
            const items = tasks.filter((task) => task.dueDate === key)
            const isToday = key === formatDate(today)
            return (
              <div className={`calendar-day ${isToday ? 'active' : ''}`} key={key}>
                <div className="small muted">{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                <strong>{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</strong>
                <div className="list" style={{ marginTop: 12 }}>
                  {items.slice(0, 3).map((task) => (
                    <div className="mini-item" key={task.id}>
                      <strong>{task.title}</strong>
                      <div className="small muted">{task.clientId ? clientMap.get(task.clientId) ?? 'Client' : 'General'} · {task.status.replace('_', ' ')}</div>
                    </div>
                  ))}
                  {items.length > 3 ? <div className="small muted">+{items.length - 3} more</div> : null}
                  {items.length === 0 ? <div className="small muted">No deadlines</div> : null}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
