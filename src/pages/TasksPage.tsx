import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addSubtask,
  addTaskComment,
  archiveTask,
  createTask,
  getClients,
  getTasks,
  restoreTask,
  toggleSubtask,
  updateTask,
} from '../lib/mockApi'
import { useToast } from '../components/ToastProvider'
import type { RecurrenceRule, Task, TaskPriority, TaskStatus } from '../types'

const SAVED_VIEW_KEY = 'clientflow_task_saved_view'
const columns: { id: TaskStatus; label: string; hint: string }[] = [
  { id: 'todo', label: 'Todo', hint: 'Planned work' },
  { id: 'in_progress', label: 'In progress', hint: 'Active delivery' },
  { id: 'done', label: 'Done', hint: 'Completed' },
]

function getSavedView() {
  try {
    const raw = localStorage.getItem(SAVED_VIEW_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function TaskCard({ task, clientName, onMove, onArchive, onRestore, onAddSubtask, onToggleSubtask, onAddComment }: {
  task: Task
  clientName: string
  onMove: (id: string, status: TaskStatus) => void
  onArchive: (id: string) => void
  onRestore: (id: string) => void
  onAddSubtask: (id: string, title: string) => void
  onToggleSubtask: (taskId: string, subtaskId: string) => void
  onAddComment: (id: string, content: string) => void
}) {
  const [subtaskTitle, setSubtaskTitle] = useState('')
  const [comment, setComment] = useState('')
  const subtasks = task.subtasks ?? []
  const comments = task.comments ?? []
  const doneSubtasks = subtasks.filter((item) => item.done).length

  function handleSubtaskSubmit(event: FormEvent) {
    event.preventDefault()
    if (!subtaskTitle.trim()) return
    onAddSubtask(task.id, subtaskTitle.trim())
    setSubtaskTitle('')
  }

  function handleCommentSubmit(event: FormEvent) {
    event.preventDefault()
    if (!comment.trim()) return
    onAddComment(task.id, comment.trim())
    setComment('')
  }

  return (
    <article className={`kanban-card ${task.archived ? 'archived' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <strong>{task.title}</strong>
          <div className="small muted">{clientName}</div>
        </div>
        <span className={`badge ${task.priority}`}>{task.priority}</span>
      </div>
      <p className="small" style={{ marginBottom: 10 }}>{task.description || 'No description yet.'}</p>
      <div className="task-meta-row">
        <span className="badge">Due {task.dueDate || 'not set'}</span>
        <span className="badge">{task.recurrence ?? 'none'}</span>
        {(task.tags ?? []).map((tag) => <span className="badge" key={tag}>{tag}</span>)}
      </div>
      <div className="subtask-box">
        <div className="small muted">Subtasks {doneSubtasks}/{subtasks.length}</div>
        <div className="subtask-progress"><span style={{ width: `${subtasks.length ? (doneSubtasks / subtasks.length) * 100 : 0}%` }} /></div>
        <div className="list" style={{ marginTop: 8 }}>
          {subtasks.map((subtask) => (
            <label className="subtask-item" key={subtask.id}>
              <input type="checkbox" checked={subtask.done} onChange={() => onToggleSubtask(task.id, subtask.id)} />
              <span>{subtask.title}</span>
            </label>
          ))}
        </div>
        <form className="inline-form" onSubmit={handleSubtaskSubmit}>
          <input className="input" value={subtaskTitle} onChange={(event) => setSubtaskTitle(event.target.value)} placeholder="Add subtask..." />
          <button className="button secondary">Add</button>
        </form>
      </div>
      <div className="comment-box">
        <div className="small muted">Comments · {comments.length}</div>
        {comments.slice(-2).map((item) => (
          <div className="mini-item" key={item.id}>
            <strong>{item.author}</strong>
            <div className="small muted">{item.content}</div>
          </div>
        ))}
        <form className="inline-form" onSubmit={handleCommentSubmit}>
          <input className="input" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add comment..." />
          <button className="button secondary">Post</button>
        </form>
      </div>
      <div className="toolbar">
        {columns.map((column) => (
          <button className="button secondary" key={column.id} onClick={() => onMove(task.id, column.id)} type="button">
            {column.label}
          </button>
        ))}
        {task.archived ? (
          <button className="button" onClick={() => onRestore(task.id)} type="button">Restore</button>
        ) : (
          <button className="button danger" onClick={() => onArchive(task.id)} type="button">Archive</button>
        )}
      </div>
    </article>
  )
}

export function TasksPage() {
  const queryClient = useQueryClient()
  const { pushToast, pushUndoToast } = useToast()
  const savedView = getSavedView()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [clientId, setClientId] = useState<string>('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [dueDate, setDueDate] = useState('')
  const [recurrence, setRecurrence] = useState<RecurrenceRule>('none')
  const [tags, setTags] = useState('')
  const [search, setSearch] = useState(savedView?.search ?? '')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>(savedView?.priority ?? 'all')
  const [showArchived, setShowArchived] = useState(false)

  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  const refreshTasks = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (task) => {
      refreshTasks()
      pushToast({ title: 'Task created', message: task.title, tone: 'success' })
      setTitle('')
      setDescription('')
      setClientId('')
      setPriority('medium')
      setStatus('todo')
      setDueDate('')
      setRecurrence('none')
      setTags('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: TaskStatus }) => updateTask(id, { status: nextStatus }),
    onSuccess: (task) => {
      refreshTasks()
      pushToast({ title: 'Task moved', message: `${task.title} is now ${task.status.replace('_', ' ')}.`, tone: 'success' })
    },
  })

  const archiveMutation = useMutation({
    mutationFn: archiveTask,
    onSuccess: (task) => {
      refreshTasks()
      pushUndoToast('Task archived', `${task.title} moved to archive.`, () => restoreMutation.mutate(task.id))
    },
  })
  const restoreMutation = useMutation({
    mutationFn: restoreTask,
    onSuccess: (task) => {
      refreshTasks()
      pushToast({ title: 'Task restored', message: task.title, tone: 'success' })
    },
  })
  const addSubtaskMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => addSubtask(id, title),
    onSuccess: (task) => {
      refreshTasks()
      pushToast({ title: 'Subtask added', message: task.title, tone: 'success' })
    },
  })
  const toggleSubtaskMutation = useMutation({ mutationFn: ({ taskId, subtaskId }: { taskId: string; subtaskId: string }) => toggleSubtask(taskId, subtaskId), onSuccess: refreshTasks })
  const addCommentMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => addTaskComment(id, content),
    onSuccess: (task) => {
      refreshTasks()
      pushToast({ title: 'Comment added', message: task.title, tone: 'success' })
    },
  })

  const clientsById = useMemo(() => new Map(clients.map((client) => [client.id, client.name])), [clients])
  const filteredTasks = useMemo(() => {
    const term = search.toLowerCase().trim()
    return tasks.filter((task) => {
      const matchesArchive = showArchived ? task.archived : !task.archived
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      const searchable = `${task.title} ${task.description} ${(task.tags ?? []).join(' ')} ${task.clientId ? clientsById.get(task.clientId) : ''}`.toLowerCase()
      return matchesArchive && matchesPriority && searchable.includes(term)
    })
  }, [clientsById, priorityFilter, search, showArchived, tasks])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createMutation.mutate({
      title,
      description,
      clientId: clientId || null,
      priority,
      status,
      dueDate,
      recurrence,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      subtasks: [],
      comments: [],
      archived: false,
    })
  }

  function saveView() {
    localStorage.setItem(SAVED_VIEW_KEY, JSON.stringify({ search, priority: priorityFilter }))
    pushToast({ title: 'View saved', message: 'Your task filters are stored locally.', tone: 'success' })
  }

  function resetView() {
    setSearch('')
    setPriorityFilter('all')
    setShowArchived(false)
    localStorage.removeItem(SAVED_VIEW_KEY)
    pushToast({ title: 'View reset', message: 'Saved task filters were cleared.', tone: 'info' })
  }

  const dueToday = tasks.filter((task) => task.dueDate === new Date().toISOString().slice(0, 10) && !task.archived).length
  const recurring = tasks.filter((task) => task.recurrence && task.recurrence !== 'none' && !task.archived).length

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Operations</p>
          <h1 className="page-title">Tasks</h1>
          <p className="muted">Kanban workflow with recurring tasks, subtasks, comments, tags, archive and saved views.</p>
        </div>
        <div className="toolbar">
          <button className="button secondary" onClick={saveView} type="button">Save view</button>
          <button className="button secondary" onClick={resetView} type="button">Reset</button>
        </div>
      </div>
      <section className="grid stats">
        <div className="card card-pad stat-card"><div className="small muted">Visible tasks</div><div className="stat-value">{filteredTasks.length}</div><div className="stat-change">Saved filters ready</div></div>
        <div className="card card-pad stat-card"><div className="small muted">Due today</div><div className="stat-value">{dueToday}</div><div className="stat-change">Smart widget</div></div>
        <div className="card card-pad stat-card"><div className="small muted">Recurring</div><div className="stat-value">{recurring}</div><div className="stat-change">Automation-ready</div></div>
        <div className="card card-pad stat-card"><div className="small muted">Archived</div><div className="stat-value">{tasks.filter((task) => task.archived).length}</div><div className="stat-change">Clean workspace</div></div>
      </section>
      <section className="card card-pad sticky-filter-card">
        <div className="toolbar">
          <input className="input" style={{ maxWidth: 420 }} placeholder="Search task, tag, client..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className="select" style={{ maxWidth: 220 }} value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as TaskPriority | 'all')}>
            <option value="all">All priorities</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
          <button className={`button ${showArchived ? '' : 'secondary'}`} onClick={() => setShowArchived((current) => !current)} type="button">{showArchived ? 'Showing archived' : 'Active only'}</button>
        </div>
      </section>
      <div className="two-col tasks-layout">
        <section className="kanban-board">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((task) => task.status === column.id)
            return (
              <div className="kanban-column" key={column.id}>
                <div className="card-title-row"><div><h2 style={{ margin: 0 }}>{column.label}</h2><div className="small muted">{column.hint}</div></div><span className="pill">{columnTasks.length}</span></div>
                <div className="list">
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} clientName={task.clientId ? clientsById.get(task.clientId) ?? 'Unknown client' : 'General'} onMove={(id, nextStatus) => updateMutation.mutate({ id, nextStatus })} onArchive={(id) => archiveMutation.mutate(id)} onRestore={(id) => restoreMutation.mutate(id)} onAddSubtask={(id, nextTitle) => addSubtaskMutation.mutate({ id, title: nextTitle })} onToggleSubtask={(taskId, subtaskId) => toggleSubtaskMutation.mutate({ taskId, subtaskId })} onAddComment={(id, content) => addCommentMutation.mutate({ id, content })} />
                  ))}
                  {columnTasks.length === 0 ? <div className="empty-state">No tasks here.</div> : null}
                </div>
              </div>
            )
          })}
        </section>
        <aside className="card card-pad sticky-action-panel">
          <div className="card-title-row"><div><h2 style={{ margin: 0 }}>Quick add</h2><div className="small muted">Create tagged, recurring work in one flow.</div></div></div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea className="textarea" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            <select className="select" value={clientId} onChange={(e) => setClientId(e.target.value)}><option value="">General task</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select>
            <select className="select" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select>
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}><option value="todo">todo</option><option value="in_progress">in progress</option><option value="done">done</option></select>
            <select className="select" value={recurrence} onChange={(e) => setRecurrence(e.target.value as RecurrenceRule)}><option value="none">no recurrence</option><option value="daily">daily</option><option value="weekly">weekly</option><option value="monthly">monthly</option></select>
            <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <input className="input" placeholder="Tags, comma separated" value={tags} onChange={(e) => setTags(e.target.value)} />
            <button className="button" disabled={createMutation.isPending}>{createMutation.isPending ? 'Saving...' : 'Save task'}</button>
          </form>
        </aside>
      </div>
    </div>
  )
}
