import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  addClientCustomField,
  archiveClient,
  createNote,
  getClientById,
  getNotes,
  getTasks,
  markClientContacted,
  restoreClient,
  toggleClientPinned,
  updateClient,
} from '../lib/mockApi'
import type { ClientStage, ClientStatus } from '../types'

const stages: ClientStage[] = ['new', 'qualified', 'proposal', 'negotiation', 'won', 'paused']

export function ClientDetailsPage() {
  const { id = '' } = useParams()
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const [fieldLabel, setFieldLabel] = useState('')
  const [fieldValue, setFieldValue] = useState('')

  const { data: client } = useQuery({ queryKey: ['client', id], queryFn: () => getClientById(id) })
  const { data: notes = [] } = useQuery({ queryKey: ['notes', id], queryFn: () => getNotes(id) })
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['client', id] })
    queryClient.invalidateQueries({ queryKey: ['clients'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const addNoteMutation = useMutation({
    mutationFn: (text: string) => createNote(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', id] })
      setContent('')
    },
  })

  const updateClientMutation = useMutation({ mutationFn: updateClient, onSuccess: refresh })
  const pinMutation = useMutation({ mutationFn: toggleClientPinned, onSuccess: refresh })
  const archiveMutation = useMutation({ mutationFn: archiveClient, onSuccess: refresh })
  const restoreMutation = useMutation({ mutationFn: restoreClient, onSuccess: refresh })
  const contactMutation = useMutation({ mutationFn: markClientContacted, onSuccess: refresh })
  const customFieldMutation = useMutation({
    mutationFn: ({ label, value }: { label: string; value: string }) => addClientCustomField(id, label, value),
    onSuccess: () => {
      refresh()
      setFieldLabel('')
      setFieldValue('')
    },
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!content.trim()) return
    addNoteMutation.mutate(content)
  }

  function handleCustomFieldSubmit(event: FormEvent) {
    event.preventDefault()
    if (!fieldLabel.trim() || !fieldValue.trim()) return
    customFieldMutation.mutate({ label: fieldLabel.trim(), value: fieldValue.trim() })
  }

  const relatedTasks = useMemo(() => tasks.filter((task) => task.clientId === id && !task.archived), [id, tasks])
  const completedTasks = relatedTasks.filter((task) => task.status === 'done').length
  const deliveryScore = relatedTasks.length ? Math.round((completedTasks / relatedTasks.length) * 100) : 100

  if (!client) {
    return <div className="card card-pad">Client not found.</div>
  }

  const healthScore = client.healthScore ?? 0

  return (
    <div className="grid">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Account view</p>
            <h1 className="page-title">{client.pinned ? '★ ' : ''}{client.name}</h1>
            <p className="muted">{client.company} · {client.email}</p>
            <div className="task-meta-row" style={{ marginTop: 14 }}>
              <span className={`badge ${client.status}`}>{client.status}</span>
              <span className="badge">{client.stage}</span>
              {(client.tags ?? []).map((tag) => <span className="badge" key={tag}>{tag}</span>)}
              {client.archived ? <span className="badge">archived</span> : null}
            </div>
          </div>
          <div className="kpi-strip">
            <div className="kpi-mini">
              <div className="small muted">Health score</div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>{healthScore}</div>
              <div className="health-bar"><span style={{ width: `${healthScore}%` }} /></div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Monthly value</div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>€{client.monthlyValue}</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Delivery score</div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>{deliveryScore}%</div>
            </div>
          </div>
        </div>
      </section>

      <section className="card card-pad sticky-filter-card">
        <div className="toolbar">
          <Link className="button secondary" to="/clients">← Back to clients</Link>
          <button className="button secondary" onClick={() => pinMutation.mutate(id)} type="button">{client.pinned ? 'Unpin' : 'Pin'} client</button>
          <button className="button secondary" onClick={() => contactMutation.mutate(id)} type="button">Mark contacted</button>
          {client.archived ? (
            <button className="button" onClick={() => restoreMutation.mutate(id)} type="button">Restore client</button>
          ) : (
            <button className="button danger" onClick={() => archiveMutation.mutate(id)} type="button">Archive client</button>
          )}
        </div>
      </section>

      <div className="two-col">
        <div className="grid">
          <div className="card card-pad">
            <div className="card-title-row">
              <div>
                <h2 style={{ margin: 0 }}>Account controls</h2>
                <div className="small muted">Update status, pipeline stage and relationship details.</div>
              </div>
            </div>
            <div className="form-grid">
              <label className="small muted">Status</label>
              <select className="select" value={client.status} onChange={(event) => updateClientMutation.mutate({ id, payload: { status: event.target.value as ClientStatus } } as never)}>
                <option value="lead">lead</option>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
              <label className="small muted">Pipeline stage</label>
              <select className="select" value={client.stage} onChange={(event) => updateClientMutation.mutate({ id, payload: { stage: event.target.value as ClientStage } } as never)}>
                {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
              </select>
            </div>
          </div>

          <div className="card card-pad">
            <div className="card-title-row">
              <div>
                <h2 style={{ margin: 0 }}>Related tasks</h2>
                <div className="small muted">Delivery work linked to this account.</div>
              </div>
              <div className="pill">{completedTasks}/{relatedTasks.length} done</div>
            </div>
            <div className="list">
              {relatedTasks.map((task) => (
                <div key={task.id} className="note">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <strong>{task.title}</strong>
                    <span className={`badge ${task.status}`}>{task.status.replace('_', ' ')}</span>
                  </div>
                  <div className="small muted">{task.priority} priority · due {task.dueDate || 'not set'}</div>
                </div>
              ))}
              {relatedTasks.length === 0 ? <div className="empty-state">No tasks linked to this client.</div> : null}
            </div>
          </div>

          <div className="card card-pad">
            <div className="card-title-row">
              <div>
                <h2 style={{ margin: 0 }}>Custom fields</h2>
                <div className="small muted">Mock CRM fields for account-specific data.</div>
              </div>
            </div>
            <div className="list">
              {(client.customFields ?? []).map((field) => (
                <div className="mini-item" key={field.id}>
                  <div className="small muted">{field.label}</div>
                  <strong>{field.value}</strong>
                </div>
              ))}
              {(client.customFields ?? []).length === 0 ? <div className="empty-state">No custom fields yet.</div> : null}
            </div>
            <form className="inline-form" style={{ marginTop: 12 }} onSubmit={handleCustomFieldSubmit}>
              <input className="input" placeholder="Field label" value={fieldLabel} onChange={(event) => setFieldLabel(event.target.value)} />
              <input className="input" placeholder="Value" value={fieldValue} onChange={(event) => setFieldValue(event.target.value)} />
              <button className="button secondary" disabled={customFieldMutation.isPending}>Add field</button>
            </form>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>Meeting notes</h2>
              <div className="small muted">Capture quick updates after calls and meetings.</div>
            </div>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <textarea className="textarea" rows={4} placeholder="Add a note after a call or meeting..." value={content} onChange={(e) => setContent(e.target.value)} />
            <button className="button" disabled={addNoteMutation.isPending}>{addNoteMutation.isPending ? 'Saving...' : 'Add note'}</button>
          </form>

          <div className="list" style={{ marginTop: 16 }}>
            {notes.map((note) => (
              <div key={note.id} className="note">
                {note.content}
                <div className="small muted" style={{ marginTop: 6 }}>{new Date(note.createdAt).toLocaleString()}</div>
              </div>
            ))}
            {notes.length === 0 ? <div className="empty-state">No notes yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
