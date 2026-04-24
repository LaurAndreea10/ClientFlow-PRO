import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getClients, getTasks } from '../lib/mockApi'

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function ReportsPage() {
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  const statusData = [
    { name: 'Leads', value: clients.filter((client) => client.status === 'lead').length },
    { name: 'Active', value: clients.filter((client) => client.status === 'active').length },
    { name: 'Inactive', value: clients.filter((client) => client.status === 'inactive').length },
  ]

  const deliveryData = [
    { name: 'Todo', value: tasks.filter((task) => task.status === 'todo').length },
    { name: 'Progress', value: tasks.filter((task) => task.status === 'in_progress').length },
    { name: 'Done', value: tasks.filter((task) => task.status === 'done').length },
  ]

  const revenueData = useMemo(() => {
    const total = clients.reduce((sum, client) => sum + client.monthlyValue, 0)
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => ({
      month,
      revenue: Math.round(total * (0.72 + index * 0.055)),
    }))
  }, [clients])

  const totalRevenue = clients.reduce((sum, client) => sum + client.monthlyValue, 0)
  const completionRate = tasks.length ? Math.round((tasks.filter((task) => task.status === 'done').length / tasks.length) * 100) : 0
  const activeClients = clients.filter((client) => client.status === 'active').length

  function exportJson() {
    downloadFile('clientflow-report.json', JSON.stringify({ clients, tasks, exportedAt: new Date().toISOString() }, null, 2), 'application/json')
  }

  function exportCsv() {
    const rows = [
      ['Metric', 'Value'],
      ['Clients', clients.length.toString()],
      ['Active clients', activeClients.toString()],
      ['Tasks', tasks.length.toString()],
      ['Completion rate', `${completionRate}%`],
      ['Monthly revenue', `€${totalRevenue}`],
    ]
    downloadFile('clientflow-report.csv', rows.map((row) => row.join(',')).join('\n'), 'text/csv')
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1 className="page-title">Reports</h1>
          <p className="muted">Portfolio-ready analytics with exportable local demo data.</p>
        </div>
        <div className="toolbar">
          <button className="button secondary" onClick={exportCsv}>Export CSV</button>
          <button className="button" onClick={exportJson}>Export JSON</button>
        </div>
      </div>

      <section className="grid stats">
        <div className="card card-pad stat-card">
          <div className="small muted">Monthly revenue</div>
          <div className="stat-value">€{totalRevenue}</div>
          <div className="stat-change">+12% demo trend</div>
        </div>
        <div className="card card-pad stat-card">
          <div className="small muted">Active clients</div>
          <div className="stat-value">{activeClients}</div>
          <div className="stat-change">Pipeline health</div>
        </div>
        <div className="card card-pad stat-card">
          <div className="small muted">Completion rate</div>
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-change">Delivery signal</div>
        </div>
        <div className="card card-pad stat-card">
          <div className="small muted">Open work</div>
          <div className="stat-value">{tasks.filter((task) => task.status !== 'done').length}</div>
          <div className="stat-change">Smart workload</div>
        </div>
      </section>

      <section className="two-col">
        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>Revenue forecast</h2>
              <div className="small muted">Mock trend generated from local client retainers.</div>
            </div>
            <button className="button secondary" onClick={() => window.print()}>Print / PDF</button>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>Pipeline and delivery</h2>
              <div className="small muted">Side-by-side client and task distribution.</div>
            </div>
          </div>
          <div className="split-stats">
            <div style={{ height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={statusData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis allowDecimals={false} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={deliveryData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis allowDecimals={false} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} />
                  <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
