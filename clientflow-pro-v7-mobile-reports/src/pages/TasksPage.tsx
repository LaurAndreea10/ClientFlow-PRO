import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask, deleteTask, getClients, getTasks, updateTask } from '../lib/mockApi'
import type { Task, TaskPriority, TaskStatus } from '../types'

const defaultForm = {
  title: '',
  description: '',
  clientId: '',
  priority: 'medium' as TaskPriority,
  status: 'todo' as TaskStatus,
  dueDate: '',
}

export function TasksPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(defaultForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all')

  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      refresh()
      setForm(defaultForm)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Task> }) => updateTask(id, payload),
    onSuccess: () => {
      refresh()
      setEditingId(null)
      setForm(defaultForm)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: refresh,
  })

  const tasksWithClient = useMemo(() => {
    const map = new Map(clients.map((client) => [client.id, client.name]))
    return tasks
      .map((task) => ({ ...task, clientName: task.clientId ? map.get(task.clientId) ?? 'Unknown client' : 'General' }))
      .filter((task) => (statusFilter === 'all' ? true : task.status === statusFilter))
      .filter((task) => (priorityFilter === 'all' ? true : task.priority === priorityFilter))
  }, [clients, tasks, statusFilter, priorityFilter])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const payload = {
      title: form.title,
      description: form.description,
      clientId: form.clientId || null,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate,
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload })
      return
    }

    createMutation.mutate(payload)
  }

  function startEdit(task: Task) {
    setEditingId(task.id)
    setForm({
      title: task.title,
      description: task.description,
      clientId: task.clientId ?? '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setForm(defaultForm)
  }

  return (
    <div className="grid page-gap-lg">
      <div className="page-header stack-on-mobile">
        <div>
          <p className="eyebrow">Operations</p>
          <h1 className="page-title">Tasks</h1>
          <p className="muted">Track workload, edit tasks quickly and keep delivery clear on small screens too.</p>
        </div>
        <div className="page-header-actions mobile-full">
          <div className="pill">✅ {tasks.filter((item) => item.status === 'done').length} done</div>
          <div className="pill">🔥 {tasks.filter((item) => item.priority === 'high').length} high priority</div>
        </div>
      </div>

      <div className="two-col two-col-equal mobile-reverse">
        <div className="card card-pad sticky-card-mobile">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>{editingId ? 'Edit task' : 'Create task'}</h2>
              <div className="small muted">{editingId ? 'Adjust details, priority or linked client.' : 'Attach it to a client or keep it general.'}</div>
            </div>
            {editingId ? <button className="button secondary" onClick={resetForm}>Cancel</button> : null}
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder="Task title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
            <textarea className="textarea" placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={4} />
            <select className="select" value={form.clientId} onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))}>
              <option value="">General task</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
            <select className="select" value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
            <select className="select" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as TaskStatus }))}>
              <option value="todo">todo</option>
              <option value="in_progress">in progress</option>
              <option value="done">done</option>
            </select>
            <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} />
            <button className="button" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? 'Save changes' : createMutation.isPending ? 'Saving...' : 'Save task'}
            </button>
          </form>
        </div>

        <div className="card card-pad">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>Task board</h2>
              <div className="small muted">Filter by status and priority, then edit inline.</div>
            </div>
            <div className="pill">🗂️ {tasksWithClient.length} visible</div>
          </div>

          <div className="toolbar toolbar-stack-mobile" style={{ marginBottom: 16 }}>
            <select className="select compact-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | TaskStatus)}>
              <option value="all">All statuses</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <select className="select compact-control" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as 'all' | TaskPriority)}>
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="mobile-card-list">
            {tasksWithClient.map((task) => (
              <article key={task.id} className="mobile-list-card">
                <div className="mobile-list-row">
                  <div>
                    <strong>{task.title}</strong>
                    <div className="small muted">{task.clientName}</div>
                  </div>
                  <span className={`badge ${task.priority}`}>{task.priority}</span>
                </div>
                <p className="small" style={{ marginTop: 10, marginBottom: 10 }}>{task.description || 'No description yet.'}</p>
                <div className="mobile-list-row wrap-row">
                  <div className="toolbar compact-toolbar wrap-row">
                    <span className={`badge ${task.status}`}>{task.status.replace('_', ' ')}</span>
                    {task.dueDate ? <span className="pill small-pill">📅 {task.dueDate}</span> : <span className="pill small-pill">No deadline</span>}
                  </div>
                  <div className="toolbar compact-toolbar">
                    <button className="button secondary" onClick={() => startEdit(task)}>Edit</button>
                    <button className="button danger" onClick={() => deleteMutation.mutate(task.id)}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
            {tasksWithClient.length === 0 ? (
              <div className="empty-state premium-empty-state">
                <div className="empty-icon">🧩</div>
                <strong>No tasks in this view.</strong>
                <div className="small muted">Create a new task or relax the current filters.</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
