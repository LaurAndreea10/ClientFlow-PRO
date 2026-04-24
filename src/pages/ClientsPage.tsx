import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { archiveClient, createClient, getClients, restoreClient, toggleClientPinned, updateClient } from '../lib/mockApi'
import { useToast } from '../components/ToastProvider'
import { useLanguage } from '../lib/i18n'
import { getPageCopy } from '../lib/pageCopy'
import type { ClientStage, ClientStatus } from '../types'

const stageIds: ClientStage[] = ['new', 'qualified', 'proposal', 'negotiation', 'won', 'paused']

export function ClientsPage() {
  const queryClient = useQueryClient()
  const { pushToast, pushUndoToast } = useToast()
  const { language } = useLanguage()
  const t = getPageCopy(language).clients
  const stages = stageIds.map((id) => ({ id, label: t.stageLabels[id] }))
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
      pushToast({ title: t.clientCreated, message: `${client.name} ${t.addedToPipeline}`, tone: 'success' })
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
      pushToast({ title: t.pipelineUpdated, message: `${client.name} ${t.movedTo} ${client.stage ? t.stageLabels[client.stage] : ''}.`, tone: 'success' })
    },
  })
  const pinMutation = useMutation({
    mutationFn: toggleClientPinned,
    onSuccess: (client) => {
      refresh()
      pushToast({ title: client.pinned ? t.clientPinned : t.clientUnpinned, message: client.name, tone: 'success' })
    },
  })
  const archiveMutation = useMutation({
    mutationFn: archiveClient,
    onSuccess: (client) => {
      refresh()
      pushUndoToast(t.clientArchived, `${client.name} ${t.movedOut}`, () => restoreMutation.mutate(client.id))
    },
  })
  const restoreMutation = useMutation({
    mutationFn: restoreClient,
    onSuccess: (client) => {
      refresh()
      pushToast({ title: t.clientRestored, message: `${client.name} ${t.activeAgain}`, tone: 'success' })
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
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="page-title">{t.title}</h1>
          <p className="muted">{t.description}</p>
        </div>
        <div className="toolbar">
          <button className={`button ${view === 'pipeline' ? '' : 'secondary'}`} onClick={() => setView('pipeline')} type="button">{t.pipeline}</button>
          <button className={`button ${view === 'table' ? '' : 'secondary'}`} onClick={() => setView('table')} type="button">{t.table}</button>
        </div>
      </div>

      <section className="grid stats">
        <div className="card card-pad stat-card"><div className="small muted">{t.visiblePipeline}</div><div className="stat-value">{filtered.length}</div><div className="stat-change">{t.filteredAccounts}</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{t.pinned}</div><div className="stat-value">{pinnedClients.length}</div><div className="stat-change">{t.priorityClients}</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{t.avgHealth}</div><div className="stat-value">{avgHealth}</div><div className="stat-change">{t.activeAccounts}</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{t.pipelineValue}</div><div className="stat-value">€{pipelineValue}</div><div className="stat-change">{t.monthlyRetainers}</div></div>
      </section>

      <section className="card card-pad sticky-filter-card">
        <div className="toolbar">
          <input className="input" style={{ maxWidth: 380 }} placeholder={t.searchPlaceholder} value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className="select" style={{ maxWidth: 180 }} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as ClientStatus | 'all')}>
            <option value="all">{t.allStatus}</option>
            <option value="lead">{t.lead}</option>
            <option value="active">{t.active}</option>
            <option value="inactive">{t.inactive}</option>
          </select>
          <button className={`button ${showArchived ? '' : 'secondary'}`} onClick={() => setShowArchived((current) => !current)} type="button">
            {showArchived ? t.showingArchived : t.activeOnly}
          </button>
        </div>
      </section>

      <div className="two-col clients-layout">
        <section className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>{view === 'pipeline' ? t.leadPipeline : t.clientTable}</h2>
              <div className="small muted">{t.modeHint}</div>
            </div>
            <div className="pill">{filtered.length} {t.visible}</div>
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
                        <div className="small muted">{stageClients.length} {t.clients}</div>
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
                            <button className="icon-button" onClick={() => pinMutation.mutate(client.id)} type="button" aria-label={t.pin}>
                              {client.pinned ? '★' : '☆'}
                            </button>
                          </div>
                          <div className="health-row">
                            <span>{t.health}</span>
                            <strong>{client.healthScore ?? 0}</strong>
                          </div>
                          <div className="health-bar"><span style={{ width: `${client.healthScore ?? 0}%` }} /></div>
                          <div className="task-meta-row">
                            <span className={`badge ${client.status}`}>{client.status === 'active' ? t.active : client.status === 'inactive' ? t.inactive : t.lead}</span>
                            <span className="badge">€{client.monthlyValue}</span>
                            {(client.tags ?? []).map((tag) => <span className="badge" key={tag}>{tag}</span>)}
                          </div>
                          <select className="select" value={client.stage} onChange={(event) => updateMutation.mutate({ id: client.id, nextStage: event.target.value as ClientStage })}>
                            {stages.map((stageOption) => <option key={stageOption.id} value={stageOption.id}>{stageOption.label}</option>)}
                          </select>
                          {client.archived ? (
                            <button className="button" onClick={() => restoreMutation.mutate(client.id)} type="button">{t.restore}</button>
                          ) : (
                            <button className="button secondary" onClick={() => archiveMutation.mutate(client.id)} type="button">{t.archive}</button>
                          )}
                        </article>
                      ))}
                      {stageClients.length === 0 ? <div className="empty-state">{t.noClients}</div> : null}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>{t.name}</th><th>{t.company}</th><th>{t.status}</th><th>{t.stage}</th><th>{t.health}</th><th>{t.monthly}</th><th /></tr></thead>
                <tbody>
                  {filtered.map((client) => (
                    <tr key={client.id}>
                      <td><Link to={`/clients/${client.id}`}><strong>{client.pinned ? '★ ' : ''}{client.name}</strong></Link><div className="small muted">{client.email}</div></td>
                      <td>{client.company}</td>
                      <td><span className={`badge ${client.status}`}>{client.status === 'active' ? t.active : client.status === 'inactive' ? t.inactive : t.lead}</span></td>
                      <td>{client.stage ? t.stageLabels[client.stage] : ''}</td>
                      <td>{client.healthScore}</td>
                      <td>€{client.monthlyValue}</td>
                      <td><button className="button secondary" onClick={() => pinMutation.mutate(client.id)}>{client.pinned ? t.unpin : t.pin}</button></td>
                    </tr>
                  ))}
                  {filtered.length === 0 ? <tr><td colSpan={7}><div className="empty-state">{t.noClientsFound}</div></td></tr> : null}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="card card-pad sticky-action-panel">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>{t.addClient}</h2>
              <div className="small muted">{t.addClientHint}</div>
            </div>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="input" placeholder={t.company} value={company} onChange={(e) => setCompany(e.target.value)} required />
            <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="input" placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value as ClientStatus)}>
              <option value="lead">{t.lead}</option><option value="active">{t.active}</option><option value="inactive">{t.inactive}</option>
            </select>
            <select className="select" value={stage} onChange={(e) => setStage(e.target.value as ClientStage)}>
              {stages.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <input className="input" placeholder={t.monthlyValue} value={monthlyValue} onChange={(e) => setMonthlyValue(e.target.value)} />
            <input className="input" placeholder={t.tagsPlaceholder} value={tags} onChange={(e) => setTags(e.target.value)} />
            <button className="button" disabled={createMutation.isPending}>{createMutation.isPending ? t.saving : t.saveClient}</button>
          </form>
        </aside>
      </div>
    </div>
  )
}
