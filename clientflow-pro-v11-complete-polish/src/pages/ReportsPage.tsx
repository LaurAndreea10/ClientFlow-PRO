import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import { getClients, getTasks } from '../lib/mockApi'
import type { ClientStatus, TaskPriority, TaskStatus } from '../types'

const pieColors = ['#8b5cf6', '#22c55e', '#f59e0b']

export function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | ClientStatus>('all')
  const [taskFilter, setTaskFilter] = useState<'all' | TaskStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all')

  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  const filteredClients = useMemo(() => {
    return clients.filter((client) => statusFilter === 'all' || client.status === statusFilter)
  }, [clients, statusFilter])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = taskFilter === 'all' || task.status === taskFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      const matchesClientStatus =
        statusFilter === 'all' || filteredClients.some((client) => client.id === task.clientId)
      return matchesStatus && matchesPriority && matchesClientStatus
    })
  }, [tasks, taskFilter, priorityFilter, statusFilter, filteredClients])

  const revenueData = useMemo(() => {
    const rows = [
      { name: 'Lead', value: 0 },
      { name: 'Active', value: 0 },
      { name: 'Inactive', value: 0 },
    ]
    filteredClients.forEach((client) => {
      const row = rows.find((item) => item.name.toLowerCase() === client.status)
      if (row) row.value += client.monthlyValue
    })
    return rows
  }, [filteredClients])

  const workloadData = useMemo(() => {
    return [
      { name: 'To do', count: filteredTasks.filter((task) => task.status === 'todo').length },
      { name: 'In progress', count: filteredTasks.filter((task) => task.status === 'in_progress').length },
      { name: 'Done', count: filteredTasks.filter((task) => task.status === 'done').length },
    ]
  }, [filteredTasks])

  const priorityMix = useMemo(() => {
    return [
      { name: 'High', value: filteredTasks.filter((task) => task.priority === 'high').length },
      { name: 'Medium', value: filteredTasks.filter((task) => task.priority === 'medium').length },
      { name: 'Low', value: filteredTasks.filter((task) => task.priority === 'low').length },
    ]
  }, [filteredTasks])

  const totals = useMemo(() => {
    const revenue = filteredClients.reduce((sum, client) => sum + client.monthlyValue, 0)
    const conversion = clients.length ? Math.round((clients.filter((item) => item.status === 'active').length / clients.length) * 100) : 0
    const completion = filteredTasks.length ? Math.round((filteredTasks.filter((task) => task.status === 'done').length / filteredTasks.length) * 100) : 0
    const avgValue = filteredClients.length ? Math.round(revenue / filteredClients.length) : 0
    return { revenue, conversion, completion, avgValue }
  }, [filteredClients, filteredTasks, clients])

  return (
    <div className="grid page-gap-lg">
      <div className="page-header stack-on-mobile">
        <div>
          <p className="eyebrow">Reports & analytics</p>
          <h1 className="page-title">Reports</h1>
          <p className="muted">A recruiter-friendly analytics page with filters, charts and clear KPIs, built entirely on free local demo data.</p>
        </div>
        <div className="page-header-actions mobile-full">
          <div className="pill">📈 Analytics</div>
          <div className="pill">💶 €{totals.revenue} tracked</div>
        </div>
      </div>

      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Performance snapshot</p>
            <h2 className="page-title" style={{ fontSize: '2rem' }}>Understand revenue, workload and delivery health.</h2>
            <p className="muted" style={{ maxWidth: 620 }}>
              This page turns the project from CRUD-only into a more complete product story: analytics, decision support and mobile-friendly filtering.
            </p>
          </div>
          <div className="kpi-strip">
            <div className="kpi-mini">
              <div className="small muted">Revenue</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>€{totals.revenue}</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Completion</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>{totals.completion}%</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Avg client value</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>€{totals.avgValue}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="card card-pad">
        <div className="card-title-row stack-on-mobile">
          <div>
            <h2 style={{ margin: 0 }}>Filters</h2>
            <div className="small muted">Narrow analytics by client status, task status and task priority.</div>
          </div>
          <div className="pill">📱 Mobile-first controls</div>
        </div>

        <div className="toolbar toolbar-stack-mobile wrap-row">
          <select className="select compact-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | ClientStatus)}>
            <option value="all">All client statuses</option>
            <option value="lead">Lead clients</option>
            <option value="active">Active clients</option>
            <option value="inactive">Inactive clients</option>
          </select>
          <select className="select compact-control" value={taskFilter} onChange={(e) => setTaskFilter(e.target.value as 'all' | TaskStatus)}>
            <option value="all">All task statuses</option>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
          <select className="select compact-control" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as 'all' | TaskPriority)}>
            <option value="all">All priorities</option>
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>
        </div>
      </section>

      <section className="grid stats">
        <div className="card card-pad stat-card">
          <div className="small muted">Conversion to active</div>
          <div className="stat-value">{totals.conversion}%</div>
          <div className="small muted">Share of all clients currently marked active</div>
        </div>
        <div className="card card-pad stat-card">
          <div className="small muted">Filtered clients</div>
          <div className="stat-value">{filteredClients.length}</div>
          <div className="small muted">Accounts included in this report view</div>
        </div>
        <div className="card card-pad stat-card">
          <div className="small muted">Filtered tasks</div>
          <div className="stat-value">{filteredTasks.length}</div>
          <div className="small muted">Tasks matching your current workload filters</div>
        </div>
        <div className="card card-pad stat-card">
          <div className="small muted">Done tasks</div>
          <div className="stat-value">{filteredTasks.filter((task) => task.status === 'done').length}</div>
          <div className="small muted">Completed items in the current report window</div>
        </div>
      </section>

      <div className="two-col two-col-equal">
        <section className="card card-pad">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>Revenue by client status</h2>
              <div className="small muted">Useful for showing business context, not just UI implementation.</div>
            </div>
            <div className="pill">💸 Revenue mix</div>
          </div>
          <div className="chart-box">
            <ResponsiveContainer>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis allowDecimals={false} stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} />
                <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card card-pad">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>Task priority mix</h2>
              <div className="small muted">Helps reviewers see that the app handles operational prioritization too.</div>
            </div>
            <div className="pill">🧠 Delivery focus</div>
          </div>
          <div className="chart-box">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={priorityMix} dataKey="value" nameKey="name" innerRadius={54} outerRadius={84} paddingAngle={4}>
                  {priorityMix.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="two-col two-col-equal">
        <section className="card card-pad">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>Workload distribution</h2>
              <div className="small muted">See whether your current board is overloaded or healthy.</div>
            </div>
            <div className="pill">✅ Delivery status</div>
          </div>
          <div className="chart-box">
            <ResponsiveContainer>
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis allowDecimals={false} stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card card-pad">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>Portfolio talking points</h2>
              <div className="small muted">Useful lines you can adapt into README bullets or interview answers.</div>
            </div>
          </div>
          <div className="mobile-card-list compact-card-list">
            <article className="mobile-list-card">
              <div className="mobile-list-row"><strong>Analytics layer</strong><span className="pill small-pill">Added</span></div>
              <div className="small muted" style={{ marginTop: 8 }}>Shows filtered KPIs and charts using the same local data model as the main app.</div>
            </article>
            <article className="mobile-list-card">
              <div className="mobile-list-row"><strong>Mobile reporting</strong><span className="pill small-pill">Ready</span></div>
              <div className="small muted" style={{ marginTop: 8 }}>Filters stack well on mobile and charts stay readable inside rounded cards.</div>
            </article>
            <article className="mobile-list-card">
              <div className="mobile-list-row"><strong>Cost model</strong><span className="pill small-pill">€0 required</span></div>
              <div className="small muted" style={{ marginTop: 8 }}>No paid analytics service, backend or reporting tool is required to demo the project.</div>
            </article>
          </div>
        </section>
      </div>
    </div>
  )
}
