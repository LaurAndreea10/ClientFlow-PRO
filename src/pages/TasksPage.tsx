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
import { useLanguage } from '../lib/i18n'
import { getPageCopy } from '../lib/pageCopy'
import type { Language } from '../lib/i18n'
import type { RecurrenceRule, Task, TaskPriority, TaskStatus } from '../types'

const SAVED_VIEW_KEY = 'clientflow_task_saved_view'
const columnIds: TaskStatus[] = ['todo', 'in_progress', 'done']

function getSavedView() {
  try {
    const raw = localStorage.getItem(SAVED_VIEW_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function TaskCard({ task, clientName, language, onMove, onArchive, onRestore, onAddSubtask, onToggleSubtask, onAddComment }: {
  task: Task
  clientName: string
  language: Language
  onMove: (id: string, status: TaskStatus) => void
  onArchive: (id: string) => void
  onRestore: (id: string) => void
  onAddSubtask: (id: string, title: string) => void
  onToggleSubtask: (taskId: string, subtaskId: string) => void
  onAddComment: (id: string, content: string) => void
}) {
  const t = getPageCopy(language).tasks
  const columns = [
    { id: 'todo' as TaskStatus, label: t.todo },
    { id: 'in_progress' as TaskStatus, label: t.inProgress },
    { id: 'done' as TaskStatus, label: t.done },
  ]
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
        <span className={`badge ${task.priority}`}>{task.priority === 'low' ? t.low : task.priority === 'high' ? t.high : t.medium}</span>
      </div>
      <p className="small" style={{ marginBottom: 10 }}>{task.description || t.noDescription}</p>
      <div className="task-meta-row">
        <span className="badge">{t.due} {task.dueDate || t.notSet}</span>
        <span className="badge">{task.recurrence === 'daily' ? t.daily : task.recurrence === 'weekly' ? t.weekly : task.recurrence === 'monthly' ? t.monthly : t.noRecurrence}</span>
        {(task.tags ?? []).map((tag) => <span className="badge" key={tag}>{tag}</span>)}
      </div>
      <div className="subtask-box">
        <div className="small muted">{t.subtasks} {doneSubtasks}/{subtasks.length}</div>
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
          <input className="input" value={subtaskTitle} onChange={(event) => setSubtaskTitle(event.target.value)} placeholder={t.addSubtask} />
          <button className="button secondary">{t.add}</button>
        </form>
      </div>
      <div className="comment-box">
        <div className="small muted">{t.comments} · {comments.length}</div>
        {comments.slice(-2).map((item) => (
          <div className="mini-item" key={item.id}>
            <strong>{item.author}</strong>
            <div className="small muted">{item.content}</div>
          </div>
        ))}
        <form className="inline-form" onSubmit={handleCommentSubmit}>
          <input className="input" value={comment} onChange={(event) => setComment(event.target.value)} placeholder={t.addComment} />
          <button className="button secondary">{t.post}</button>
        </form>
      </div>
      <div className="toolbar">
        {columns.map((column) => (
          <button className="button secondary" key={column.id} onClick={() => onMove(task.id, column.id)} type="button">
            {column.label}
          </button>
        ))}
        {task.archived ? (
          <button className="button" onClick={() => onRestore(task.id)} type="button">{t.restore}</button>
        ) : (
          <button className="button danger" onClick={() => onArchive(task.id)} type="button">{t.archive}</button>
        )}
      </div>
    </article>
  )
}

export function TasksPage() {
  const queryClient = useQueryClient()
  const { pushToast, pushUndoToast } = useToast()
  const { language } = useLanguage()
  const t = getPageCopy(language).tasks
  const columns = [
    { id: columnIds[0], label: t.todo, hint: t.plannedWork },
    { id: columnIds[1], label: t.inProgress, hint: t.activeDelivery },
    { id: columnIds[2], label: t.done, hint: t.completed },
  ]
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
      pushToast({ title: t.taskCreated, message: task.title, tone: 'success' })
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
      const statusLabel = task.status === 'todo' ? t.todo : task.status === 'in_progress' ? t.inProgress : t.done
      pushToast({ title: t.taskMoved, message: `${task.title} ${t.isNow} ${statusLabel}.`, tone: 'success' })
    },
  })

  const archiveMutation = useMutation({
    mutationFn: archiveTask,
    onSuccess: (task) => {
      refreshTasks()
      pushUndoToast(t.taskArchived, `${task.title} ${t.movedToArchive}`, () => restoreMutation.mutate(task.id))
    },
  })
  const restoreMutation = useMutation({
    mutationFn: restoreTask,
    onSuccess: (task) => {
      refreshTasks()
      pushToast({ title: t.taskRestored, message: task.title, tone: 'success' })
    },
  })
  const addSubtaskMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => addSubtask(id, title),
    onSuccess: (task) => {
      refreshTasks()
      pushToast({ title: t.subtaskAdded, message: task.title, tone: 'success' })
    },
  })
  const toggleSubtaskMutation = useMutation({ mutationFn: ({ taskId, subtaskId }: { taskId: string; subtaskId: string }) => toggleSubtask(taskId, subtaskId), onSuccess: refreshTasks })
  const addCommentMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => addTaskComment(id, content),
    onSuccess: (task) => {
      refreshTasks()
      pushToast({ title: t.commentAdded, message: task.title, tone: 'success' })
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
    pushToast({ title: t.viewSaved, message: t.viewSavedMessage, tone: 'success' })
  }

  function resetView() {
    setSearch('')
    setPriorityFilter('all')
    setShowArchived(false)
    localStorage.removeItem(SAVED_VIEW_KEY)
    pushToast({ title: t.viewReset, message: t.viewResetMessage, tone: 'info' })
  }

  const dueToday = tasks.filter((task) => task.dueDate === new Date().toISOString().slice(0, 10) && !task.archived).length
  const recurring = tasks.filter((task) => task.recurrence && task.recurrence !== 'none' && !task.archived).length

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="page-title">{t.title}</h1>
          <p className="muted">{t.description}</p>
        </div>
        <div className="toolbar">
          <button className="button secondary" onClick={saveView} type="button">{t.saveView}</button>
          <button className="button secondary" onClick={resetView} type="button">{t.reset}</button>
        </div>
      </div>
      <section className="grid stats">
        <div className="card card-pad stat-card"><div className="small muted">{t.visibleTasks}</div><div className="stat-value">{filteredTasks.length}</div><div className="stat-change">{t.savedFiltersReady}</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{t.dueToday}</div><div className="stat-value">{dueToday}</div><div className="stat-change">{t.smartWidget}</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{t.recurring}</div><div className="stat-value">{recurring}</div><div className="stat-change">{t.automationReady}</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{t.archived}</div><div className="stat-value">{tasks.filter((task) => task.archived).length}</div><div className="stat-change">{t.cleanWorkspace}</div></div>
      </section>
      <section className="card card-pad sticky-filter-card">
        <div className="toolbar">
          <input className="input" style={{ maxWidth: 420 }} placeholder={t.searchPlaceholder} value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className="select" style={{ maxWidth: 220 }} value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as TaskPriority | 'all')}>
            <option value="all">{t.allPriorities}</option><option value="low">{t.low}</option><option value="medium">{t.medium}</option><option value="high">{t.high}</option>
          </select>
          <button className={`button ${showArchived ? '' : 'secondary'}`} onClick={() => setShowArchived((current) => !current)} type="button">{showArchived ? t.showingArchived : t.activeOnly}</button>
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
                    <TaskCard key={task.id} task={task} language={language} clientName={task.clientId ? clientsById.get(task.clientId) ?? t.unknownClient : t.general} onMove={(id, nextStatus) => updateMutation.mutate({ id, nextStatus })} onArchive={(id) => archiveMutation.mutate(id)} onRestore={(id) => restoreMutation.mutate(id)} onAddSubtask={(id, nextTitle) => addSubtaskMutation.mutate({ id, title: nextTitle })} onToggleSubtask={(taskId, subtaskId) => toggleSubtaskMutation.mutate({ taskId, subtaskId })} onAddComment={(id, content) => addCommentMutation.mutate({ id, content })} />
                  ))}
                  {columnTasks.length === 0 ? <div className="empty-state">{t.noTasksHere}</div> : null}
                </div>
              </div>
            )
          })}
        </section>
        <aside className="card card-pad sticky-action-panel">
          <div className="card-title-row"><div><h2 style={{ margin: 0 }}>{t.quickAdd}</h2><div className="small muted">{t.quickAddHint}</div></div></div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder={t.taskTitle} value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea className="textarea" placeholder={t.taskDescription} value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            <select className="select" value={clientId} onChange={(e) => setClientId(e.target.value)}><option value="">{t.generalTask}</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select>
            <select className="select" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}><option value="low">{t.low}</option><option value="medium">{t.medium}</option><option value="high">{t.high}</option></select>
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}><option value="todo">{t.todo}</option><option value="in_progress">{t.inProgress}</option><option value="done">{t.done}</option></select>
            <select className="select" value={recurrence} onChange={(e) => setRecurrence(e.target.value as RecurrenceRule)}><option value="none">{t.noRecurrence}</option><option value="daily">{t.daily}</option><option value="weekly">{t.weekly}</option><option value="monthly">{t.monthly}</option></select>
            <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <input className="input" placeholder={t.tagsPlaceholder} value={tags} onChange={(e) => setTags(e.target.value)} />
            <button className="button" disabled={createMutation.isPending}>{createMutation.isPending ? t.saving : t.saveTask}</button>
          </form>
        </aside>
      </div>
    </div>
  )
}
