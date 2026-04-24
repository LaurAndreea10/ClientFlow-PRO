import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { archiveClient, createClient, getClients, restoreClient, toggleClientPinned, updateClient } from '../lib/mockApi'
import { useToast } from '../components/ToastProvider'
import type { ClientStage, ClientStatus } from '../types'

const stages: { id: ClientStage; label: string }[] = [
  { id: 'new', label: 'New' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'won', label: 'Won' },
  { id: 'paused', label: 'Paused' },
]

export function ClientsPage() {
  const queryClient = useQueryClient()
  const { pushToast, pushUndoToast } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all')
  const [showArchived, setShowArchived] = useState(false)
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<ClientStatus>('lead')
  const [stage, setStage] = useState<ClientStage>('new')
  const [monthlyValue, setMonthlyValue] = useState('0')
  const [tags, setTags] = useState('')

  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['clients'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: (client) => {
      refresh()
      pushToast({ title: 'Client created', message: `${client.name} was added to the pipeline.`, tone: 'success' })
      setName('')
      setCompany('')
      setEmail('')
      setPhone('')
      setStatus('lead')
      setStage('new')
      setMonthlyValue('0')
      setTags('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, nextStage }: { id: string; nextStage: ClientStage }) => updateClient(id, { stage: nextStage }),
    onSuccess: (client) => {
      refresh()
      pushToast({ title: 'Pipeline updated', message: `${client.name} moved to ${client.stage}.`, tone: 'success' })
    },
  })
  const pinMutation = useMutation({
    mutationFn: toggleClientPinned,
    onSuccess: (client) => {
      refresh()
      pushToast({ title: client.pinned ? 'Client pinned' : 'Client unpinned', message: client.name, tone: 'success' })
    },
  })
  const archiveMutation = useMutation({
    mutationFn: archiveClient,
    onSuccess: (client) => {
      refresh()
      pushUndoToast('Client archived', `${client.name} moved out of active pipeline.`, () => restoreMutation.mutate(client.id))
    },
  })
  const restoreMutation = useMutation({
    mutationFn: restoreClient,
    onSuccess: (client) => {
      refresh()
      pushToast({ title: 'Client restored', message: `${client.name} is active again.`, tone: 'success' })
    },
  })

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    return clients
      .filter((client) => (showArchived ? client.archived : !client.archived))
      .filter((client) => statusFilter === 'all' || client.status === statusFilter)
      .filter((client) => `${client.name} ${client.company} ${client.email} ${(client.tags ?? []).join(' ')}`.toLowerCase().includes(term))
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || (b.healthScore ?? 0) - (a.healthScore ?? 0))
  }, [clients, search, showArchived, statusFilter])

  const pinnedClients = clients.filter((client) => client.pinned && !client.archived)
  const activeClients = clients.filter((client) => client.status === 'active' && !client.archived)
  const avgHealth = activeClients.length ? Math.round(activeClients.reduce((sum, client) => sum + (client.healthScore ?? 0), 0) / activeClients.length) : 0
  const pipelineValue = filtered.reduce((sum, client) => sum + client.monthlyValue, 0)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createMutation.mutate({
      name,
      company,
      email,
      phone,
      status,
      stage,
      monthlyValue: Number(monthlyValue) || 0,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      pinned: false,
      archived: false,
      customFields: [],
    })
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Client management</p>
          <h1 className="page-title">Clients</h1>
          <p className="muted">Pipeline, health score, pinned accounts, tags, archive and custom CRM fields.</p>
        </div>
        <div className="toolbar">
          <button className={`button ${view === 'pipeline' ? '' : 'secondary'}`} onClick={() => setView('pipeline')} type="button">Pipeline</button>
          <button className={`button ${view === 'table' ? '' : 'secondary'}`} onClick={() => setView('table')} type="button">Table</button>
        </div>
      </div>

      <section className="grid stats">
        <div className="card card-pad stat-card"><div className="small muted">Visible pipeline</div><div className="stat-value">{filtered.length}</div><div className="stat-change">Filtered accounts</div></div>
        <div className="card card-pad stat-card"><div className="small muted">Pinned</div><div className="stat-value">{pinnedClients.length}</div><div className="stat-change">Priority clients</div></div>
        <div className="card card-pad stat-card"><div className="small muted">Avg health</div><div className="stat-value">{avgHealth}</div><div className="stat-change">Active accounts</div></div>
        <div className="card card-pad stat-card"><div className="small muted">Pipeline value</div><div className="stat-value">€{pipelineValue}</div><div className="stat-change">Monthly retainers</div></div>
      </section>

      <section className="card card-pad sticky-filter-card">
        <div className="toolbar">
          <input className="input" style={{ maxWidth: 380 }} placeholder="Search clients, tags, companies..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className="select" style={{ maxWidth: 180 }} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as ClientStatus | 'all')}>
            <option value="all">All status</option>
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className={`button ${showArchived ? '' : 'secondary'}`} onClick={() => setShowArchived((current) => !current)} type="button">
            {showArchived ? 'Showing archived' : 'Active only'}
          </button>
        </div>
      </section>

      <div className="two-col clients-layout">
        <section className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>{view === 'pipeline' ? 'Lead pipeline' : 'Client table'}</h2>
              <div className="small muted">Move clients through stages or inspect them in table mode.</div>
            </div>
            <div className="pill">{filtered.length} visible</div>
          </div>

          {view === 'pipeline' ? (
            <div className="client-pipeline">
              {stages.map((item) => {
                const stageClients = filtered.filter((client) => client.stage === item.id)
                return (
                  <div className="client-stage" key={item.id}>
                    <div className="card-title-row">
                      <div>
                        <strong>{item.label}</strong>
                        <div className="small muted">{stageClients.length} clients</div>
                      </div>
                    </div>
                    <div className="list">
                      {stageClients.map((client) => (
                        <article className={`client-card ${client.archived ? 'archived' : ''}`} key={client.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <div>
                              <Link to={`/clients/${client.id}`}><strong>{client.name}</strong></Link>
                              <div className="small muted">{client.company}</div>
                            </div>
                            <button className="icon-button" onClick={() => pinMutation.mutate(client.id)} type="button" aria-label="Pin client">
                              {client.pinned ? '★' : '☆'}
                            </button>
                          </div>
                          <div className="health-row">
                            <span>Health</span>
                            <strong>{client.healthScore ?? 0}</strong>
                          </div>
                          <div className="health-bar"><span style={{ width: `${client.healthScore ?? 0}%` }} /></div>
                          <div className="task-meta-row">
                            <span className={`badge ${client.status}`}>{client.status}</span>
                            <span className="badge">€{client.monthlyValue}</span>
                            {(client.tags ?? []).map((tag) => <span className="badge" key={tag}>{tag}</span>)}
                          </div>
                          <select className="select" value={client.stage} onChange={(event) => updateMutation.mutate({ id: client.id, nextStage: event.target.value as ClientStage })}>
                            {stages.map((stageOption) => <option key={stageOption.id} value={stageOption.id}>{stageOption.label}</option>)}
                          </select>
                          {client.archived ? (
                            <button className="button" onClick={() => restoreMutation.mutate(client.id)} type="button">Restore</button>
                          ) : (
                            <button className="button secondary" onClick={() => archiveMutation.mutate(client.id)} type="button">Archive</button>
                          )}
                        </article>
                      ))}
                      {stageClients.length === 0 ? <div className="empty-state">No clients.</div> : null}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Company</th><th>Status</th><th>Stage</th><th>Health</th><th>Monthly</th><th /></tr></thead>
                <tbody>
                  {filtered.map((client) => (
                    <tr key={client.id}>
                      <td><Link to={`/clients/${client.id}`}><strong>{client.pinned ? '★ ' : ''}{client.name}</strong></Link><div className="small muted">{client.email}</div></td>
                      <td>{client.company}</td>
                      <td><span className={`badge ${client.status}`}>{client.status}</span></td>
                      <td>{client.stage}</td>
                      <td>{client.healthScore}</td>
                      <td>€{client.monthlyValue}</td>
                      <td><button className="button secondary" onClick={() => pinMutation.mutate(client.id)}>{client.pinned ? 'Unpin' : 'Pin'}</button></td>
                    </tr>
                  ))}
                  {filtered.length === 0 ? <tr><td colSpan={7}><div className="empty-state">No clients found.</div></td></tr> : null}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="card card-pad sticky-action-panel">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>Add client</h2>
              <div className="small muted">Create a tagged account with stage and status.</div>
            </div>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="input" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} required />
            <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value as ClientStatus)}>
              <option value="lead">lead</option><option value="active">active</option><option value="inactive">inactive</option>
            </select>
            <select className="select" value={stage} onChange={(e) => setStage(e.target.value as ClientStage)}>
              {stages.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <input className="input" placeholder="Monthly value" value={monthlyValue} onChange={(e) => setMonthlyValue(e.target.value)} />
            <input className="input" placeholder="Tags, comma separated" value={tags} onChange={(e) => setTags(e.target.value)} />
            <button className="button" disabled={createMutation.isPending}>{createMutation.isPending ? 'Saving...' : 'Save client'}</button>
          </form>
        </aside>
      </div>
    </div>
  )
}
