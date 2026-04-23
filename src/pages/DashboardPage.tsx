import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MetricCard } from '../components/ui/MetricCard'
import { getClients, getDashboardStats, getTasks } from '../lib/mockApi'

export function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardStats,
  })

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  })

  const chartData = [
    { name: 'Lead', count: clients.filter((item) => item.status === 'lead').length },
    { name: 'Active', count: clients.filter((item) => item.status === 'active').length },
    { name: 'Inactive', count: clients.filter((item) => item.status === 'inactive').length },
  ]

  const revenueTarget = Math.max(1, Math.round((stats?.revenue ?? 0) * 1.2))

  return (
    <div className="grid">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Main workspace</p>
            <h1 className="page-title">Run your client pipeline from one dashboard.</h1>
            <p className="muted" style={{ maxWidth: 620 }}>
              This project is intentionally portfolio-friendly: realistic data model, clean UI, local persistence and a structure that can later connect to a real API.
            </p>
          </div>
          <div className="kpi-strip">
            <div className="kpi-mini">
              <div className="small muted">Revenue target</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>€{revenueTarget}</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Response time</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>24h</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Storage mode</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>Local</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid stats">
        <MetricCard label="Total clients" value={stats?.totalClients ?? 0} hint="Seeded instantly" />
        <MetricCard label="Active tasks" value={stats?.activeTasks ?? 0} hint="Open workload" />
        <MetricCard label="Completed tasks" value={stats?.completedTasks ?? 0} hint="Tracked locally" />
        <MetricCard label="Monthly revenue" value={`€${stats?.revenue ?? 0}`} hint="From client retainers" />
      </section>

      <section className="two-col">
        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>Client status mix</h2>
              <div className="small muted">Quick overview for lead quality and account health.</div>
            </div>
            <div className="pill">Demo chart</div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis allowDecimals={false} stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>Recent tasks</h2>
              <div className="small muted">Latest delivery items from your local workspace.</div>
            </div>
          </div>
          <div className="list">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="note">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <strong>{task.title}</strong>
                  <span className={`badge ${task.status}`}>{task.status.replace('_', ' ')}</span>
                </div>
                <div className="small muted" style={{ marginTop: 6 }}>
                  Due: {task.dueDate || 'No deadline'}
                </div>
              </div>
            ))}
            {tasks.length === 0 ? <div className="empty-state">No tasks available yet.</div> : null}
          </div>
        </div>
      </section>
    </div>
  )
}
