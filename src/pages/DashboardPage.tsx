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

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="muted">Portfolio-ready overview for clients, tasks, and monthly value.</p>
        </div>
      </div>

      <section className="grid stats">
        <MetricCard label="Total clients" value={stats?.totalClients ?? 0} />
        <MetricCard label="Active tasks" value={stats?.activeTasks ?? 0} />
        <MetricCard label="Completed tasks" value={stats?.completedTasks ?? 0} />
        <MetricCard label="Revenue" value={`€${stats?.revenue ?? 0}`} />
      </section>

      <section className="two-col">
        <div className="card card-pad">
          <h2 style={{ marginTop: 0 }}>Client status</h2>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card card-pad">
          <h2 style={{ marginTop: 0 }}>Recent tasks</h2>
          <div className="list">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="note">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <strong>{task.title}</strong>
                  <span className="badge">{task.status.replace('_', ' ')}</span>
                </div>
                <div className="small muted" style={{ marginTop: 6 }}>
                  Due: {task.dueDate || 'No deadline'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}