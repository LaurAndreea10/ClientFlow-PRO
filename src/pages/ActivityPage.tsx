import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getClients, getTasks } from '../lib/mockApi'

export function ActivityPage() {
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  const activity = useMemo(() => {
    const clientEvents = clients.map((client) => ({
      id: `client-${client.id}`,
      title: `${client.name} added to ${client.status} pipeline`,
      detail: `${client.company} · €${client.monthlyValue}/month`,
      date: client.createdAt,
      type: 'Client',
    }))

    const taskEvents = tasks.map((task) => ({
      id: `task-${task.id}`,
      title: `${task.title} marked ${task.status.replace('_', ' ')}`,
      detail: `${task.priority} priority · due ${task.dueDate || 'not set'}`,
      date: task.createdAt,
      type: 'Task',
    }))

    return [...clientEvents, ...taskEvents]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20)
  }, [clients, tasks])

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Audit trail</p>
          <h1 className="page-title">Activity</h1>
          <p className="muted">A clean local activity log that explains what changed across the workspace.</p>
        </div>
        <div className="pill">{activity.length} events</div>
      </div>

      <section className="two-col">
        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>Recent activity</h2>
              <div className="small muted">Generated from clients and tasks stored in this browser.</div>
            </div>
          </div>
          <div className="timeline">
            {activity.map((event) => (
              <div className="timeline-item" key={event.id}>
                <div className="timeline-dot" />
                <div className="note">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <strong>{event.title}</strong>
                    <span className="badge">{event.type}</span>
                  </div>
                  <div className="small muted" style={{ marginTop: 6 }}>{event.detail}</div>
                  <div className="small muted" style={{ marginTop: 6 }}>{new Date(event.date).toLocaleString()}</div>
                </div>
              </div>
            ))}
            {activity.length === 0 ? <div className="empty-state">No activity yet.</div> : null}
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>System notifications</h2>
              <div className="small muted">Mock notification center for demo polish.</div>
            </div>
          </div>
          <div className="list">
            <div className="note">
              <strong>Demo workspace ready</strong>
              <p className="small muted" style={{ marginBottom: 0 }}>Seeded data is available instantly after login.</p>
            </div>
            <div className="note">
              <strong>Local autosave active</strong>
              <p className="small muted" style={{ marginBottom: 0 }}>Changes are persisted in localStorage on this device.</p>
            </div>
            <div className="note">
              <strong>Portfolio mode</strong>
              <p className="small muted" style={{ marginBottom: 0 }}>No backend or paid API is required for recruiter demos.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
