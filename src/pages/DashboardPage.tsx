import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AiCopilotPanel } from '../components/AiCopilotPanel'
import { MetricCard } from '../components/ui/MetricCard'
import { useLanguage } from '../lib/i18n'
import { getClients, getDashboardStats, getTasks } from '../lib/mockApi'

export function DashboardPage() {
  const { copy } = useLanguage()
  const t = copy.dashboard
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
    { name: t.statuses.Lead, count: clients.filter((item) => item.status === 'lead').length },
    { name: t.statuses.Active, count: clients.filter((item) => item.status === 'active').length },
    { name: t.statuses.Inactive, count: clients.filter((item) => item.status === 'inactive').length },
  ]

  const revenueTarget = Math.max(1, Math.round((stats?.revenue ?? 0) * 1.2))

  return (
    <div className="grid">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="page-title">{t.title}</h1>
            <p className="muted" style={{ maxWidth: 620 }}>
              {t.description}
            </p>
          </div>
          <div className="kpi-strip">
            <div className="kpi-mini">
              <div className="small muted">{t.revenueTarget}</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>€{revenueTarget}</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">{t.responseTime}</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>24h</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">{t.storageMode}</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>{t.local}</div>
            </div>
          </div>
        </div>
      </section>

      <AiCopilotPanel clients={clients} tasks={tasks} />

      <section className="grid stats">
        <MetricCard label={t.totalClients} value={stats?.totalClients ?? 0} hint={t.seededInstantly} />
        <MetricCard label={t.activeTasks} value={stats?.activeTasks ?? 0} hint={t.openWorkload} />
        <MetricCard label={t.completedTasks} value={stats?.completedTasks ?? 0} hint={t.trackedLocally} />
        <MetricCard label={t.monthlyRevenue} value={`€${stats?.revenue ?? 0}`} hint={t.fromRetainers} />
      </section>

      <section className="two-col">
        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>{t.clientStatusMix}</h2>
              <div className="small muted">{t.statusHint}</div>
            </div>
            <div className="pill">{t.demoChart}</div>
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
              <h2 style={{ margin: 0 }}>{t.recentTasks}</h2>
              <div className="small muted">{t.recentTasksHint}</div>
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
                  {t.due}: {task.dueDate || t.noDeadline}
                </div>
              </div>
            ))}
            {tasks.length === 0 ? <div className="empty-state">{t.emptyTasks}</div> : null}
          </div>
        </div>
      </section>
    </div>
  )
}
