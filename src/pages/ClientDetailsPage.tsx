import { FormEvent, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { createNote, getClientById, getNotes, getTasks } from '../lib/mockApi'

export function ClientDetailsPage() {
  const { id = '' } = useParams()
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')

  const { data: client } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientById(id),
  })

  const { data: notes = [] } = useQuery({
    queryKey: ['notes', id],
    queryFn: () => getNotes(id),
  })

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })

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
      <div className="page-header">
        <div>
          <h1 className="page-title">{client.name}</h1>
          <p className="muted">{client.company} · {client.email}</p>
        </div>
      </div>

      <div className="two-col">
        <div className="grid">
          <div className="card card-pad">
            <h2 style={{ marginTop: 0 }}>Overview</h2>
            <div className="list">
              <div><strong>Status:</strong> <span className="badge">{client.status}</span></div>
              <div><strong>Monthly value:</strong> €{client.monthlyValue}</div>
              <div><strong>Phone:</strong> {client.phone || '—'}</div>
            </div>
          </div>

          <div className="card card-pad">
            <h2 style={{ marginTop: 0 }}>Related tasks</h2>
            <div className="list">
              {relatedTasks.map((task) => (
                <div key={task.id} className="note">
                  <strong>{task.title}</strong>
                  <div className="small muted">{task.status.replace('_', ' ')} · {task.priority}</div>
                </div>
              ))}
              {relatedTasks.length === 0 ? <div className="muted">No tasks linked to this client.</div> : null}
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <h2 style={{ marginTop: 0 }}>Meeting notes</h2>
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
            {notes.length === 0 ? <div className="muted">No notes yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}