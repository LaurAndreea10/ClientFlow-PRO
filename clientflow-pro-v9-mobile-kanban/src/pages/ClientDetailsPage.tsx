import { FormEvent, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { createNote, getClientById, getNotes, getTasks } from '../lib/mockApi'

export function ClientDetailsPage() {
  const { id = '' } = useParams()
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')

  const { data: client } = useQuery({ queryKey: ['client', id], queryFn: () => getClientById(id) })
  const { data: notes = [] } = useQuery({ queryKey: ['notes', id], queryFn: () => getNotes(id) })
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  const addNoteMutation = useMutation({
    mutationFn: (text: string) => createNote(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', id] })
      setContent('')
    },
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!content.trim()) return
    addNoteMutation.mutate(content)
  }

  const relatedTasks = tasks.filter((task) => task.clientId === id)

  if (!client) {
    return <div className="card card-pad">Client not found.</div>
  }

  return (
    <div className="grid">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Account view</p>
            <h1 className="page-title">{client.name}</h1>
            <p className="muted">{client.company} · {client.email}</p>
          </div>
          <div className="kpi-strip">
            <div className="kpi-mini">
              <div className="small muted">Status</div>
              <div style={{ marginTop: 8 }}><span className={`badge ${client.status}`}>{client.status}</span></div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Monthly value</div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>€{client.monthlyValue}</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Phone</div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>{client.phone || '—'}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="two-col">
        <div className="grid">
          <div className="card card-pad">
            <div className="card-title-row">
              <div>
                <h2 style={{ margin: 0 }}>Related tasks</h2>
                <div className="small muted">Delivery work linked to this account.</div>
              </div>
            </div>
            <div className="list">
              {relatedTasks.map((task) => (
                <div key={task.id} className="note">
                  <strong>{task.title}</strong>
                  <div className="small muted">{task.status.replace('_', ' ')} · {task.priority}</div>
                </div>
              ))}
              {relatedTasks.length === 0 ? <div className="empty-state">No tasks linked to this client.</div> : null}
            </div>
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
            <textarea
              className="textarea"
              rows={4}
              placeholder="Add a note after a call or meeting..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="button" disabled={addNoteMutation.isPending}>
              {addNoteMutation.isPending ? 'Saving...' : 'Add note'}
            </button>
          </form>

          <div className="list" style={{ marginTop: 16 }}>
            {notes.map((note) => (
              <div key={note.id} className="note">
                {note.content}
                <div className="small muted" style={{ marginTop: 6 }}>
                  {new Date(note.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
            {notes.length === 0 ? <div className="empty-state">No notes yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
