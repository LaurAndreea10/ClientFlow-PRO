import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../features/toast/ToastContext'
import { bulkDeleteTasks, bulkUpdateTasksStatus, createTask, deleteTask, getClients, getTasks, importTasksCsv, restoreDeletedTask, updateTask } from '../lib/mockApi'
import type { Task, TaskPriority, TaskStatus } from '../types'
import { LoadingBlock } from '../components/ui/LoadingBlock'
import { clearDraft, readDraft, writeDraft } from '../lib/uiState'

const defaultForm = {
  title: '',
  description: '',
  clientId: '',
  status: 'todo' as TaskStatus,
  priority: 'medium' as TaskPriority,
  dueDate: '',
}

const TASK_FORM_DRAFT = 'clientflow_draft_task_form'

export function TasksPage() {
  const queryClient = useQueryClient()
  const { pushToast } = useToast()
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all')
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'newest'>('dueDate')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null)
  const [form, setForm] = useState(() => readDraft(TASK_FORM_DRAFT, defaultForm))

  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: tasks = [], isLoading, isError } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  useEffect(() => {
    if (!editingId) writeDraft(TASK_FORM_DRAFT, form)
  }, [form, editingId])

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    queryClient.invalidateQueries({ queryKey: ['reports'] })
    queryClient.invalidateQueries({ queryKey: ['calendar'] })
    queryClient.invalidateQueries({ queryKey: ['activity'] })
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  const createMutation = useMutation({ mutationFn: createTask, onSuccess: () => { refresh(); setForm(defaultForm); clearDraft(TASK_FORM_DRAFT); pushToast('Task created', 'success') } })
  const updateMutation = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<Task> }) => updateTask(id, payload), onSuccess: () => { refresh(); setEditingId(null); setForm(defaultForm); clearDraft(TASK_FORM_DRAFT); pushToast('Task updated', 'success') } })
  const deleteMutation = useMutation({ mutationFn: deleteTask, onSuccess: (task) => { refresh(); pushToast({ title: 'Task deleted', type: 'warning', action: { label: 'Undo', onClick: async () => { await restoreDeletedTask(task); refresh() } } }) } })
  const bulkDeleteMutation = useMutation({ mutationFn: bulkDeleteTasks, onSuccess: () => { refresh(); setSelectedIds([]); pushToast('Selected tasks deleted', 'warning') } })
  const bulkStatusMutation = useMutation({ mutationFn: ({ ids, status }: { ids: string[]; status: TaskStatus }) => bulkUpdateTasksStatus(ids, status), onSuccess: () => { refresh(); setSelectedIds([]); pushToast('Bulk status updated', 'success') } })
  const importMutation = useMutation({ mutationFn: importTasksCsv, onSuccess: (count) => { refresh(); pushToast(`${count} tasks imported`, 'success') } })

  const tasksWithClient = useMemo(() => {
    const priorityScore: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 }
    const list = tasks
      .filter((task) => (statusFilter === 'all' ? true : task.status === statusFilter))
      .filter((task) => (priorityFilter === 'all' ? true : task.priority === priorityFilter))
      .map((task) => ({ ...task, clientName: clients.find((client) => client.id === task.clientId)?.name ?? 'General' }))

    if (sortBy === 'priority') return [...list].sort((a, b) => priorityScore[a.priority] - priorityScore[b.priority])
    if (sortBy === 'newest') return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    return [...list].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return +new Date(a.dueDate) - +new Date(b.dueDate)
    })
  }, [tasks, clients, statusFilter, priorityFilter, sortBy])

  const kanbanBuckets = useMemo(() => ([
    { status: 'todo' as TaskStatus, label: 'To do', icon: '🪜', items: tasksWithClient.filter((task) => task.status === 'todo') },
    { status: 'in_progress' as TaskStatus, label: 'In progress', icon: '⚡', items: tasksWithClient.filter((task) => task.status === 'in_progress') },
    { status: 'done' as TaskStatus, label: 'Done', icon: '🎯', items: tasksWithClient.filter((task) => task.status === 'done') },
  ]), [tasksWithClient])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const payload = {
      title: form.title,
      description: form.description,
      clientId: form.clientId || null,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate,
    }

    if (editingId) return updateMutation.mutate({ id: editingId, payload })
    createMutation.mutate(payload)
  }

  function startEdit(task: Task) {
    setEditingId(task.id)
    setForm({ title: task.title, description: task.description, clientId: task.clientId ?? '', status: task.status, priority: task.priority, dueDate: task.dueDate })
    setViewMode('list')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() { setEditingId(null); setForm(defaultForm); clearDraft(TASK_FORM_DRAFT) }
  function toggleSelected(id: string) { setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]) }

  function handleDrop(status: TaskStatus) {
    if (!draggingTaskId) return
    updateMutation.mutate({ id: draggingTaskId, payload: { status } })
    setDraggingTaskId(null)
    setDragOverStatus(null)
  }

  async function handleImportFile(file: File) {
    const text = await file.text()
    importMutation.mutate(text)
  }

  function confirmDeleteTask(id: string) {
    if (!window.confirm('Delete this task from the workflow?')) return
    deleteMutation.mutate(id)
  }

  function confirmBulkDelete() {
    if (!selectedIds.length || !window.confirm(`Delete ${selectedIds.length} selected tasks?`)) return
    bulkDeleteMutation.mutate(selectedIds)
  }

  return (
    <div className="grid page-gap-lg">
      <div className="page-header stack-on-mobile">
        <div>
          <p className="eyebrow">Workflow management</p>
          <h1 className="page-title">Tasks</h1>
          <p className="muted">Track workload, switch between list and Kanban, then drag cards across columns on desktop or mobile.</p>
        </div>
        <div className="page-header-actions mobile-full wrap-row">
          <div className="pill">✅ {tasks.filter((item) => item.status === 'done').length} done</div>
          <div className="pill">🔥 {tasks.filter((item) => item.priority === 'high').length} high priority</div>
          <div className="view-toggle" role="tablist" aria-label="Task views">
            <button className={`segmented-button ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')} type="button">Kanban</button>
            <button className={`segmented-button ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} type="button">List</button>
          </div>
        </div>
      </div>

      <div className="two-col two-col-equal mobile-reverse">
        <div className="card card-pad sticky-card-mobile">
          <div className="card-title-row stack-on-mobile">
            <div><h2 style={{ margin: 0 }}>{editingId ? 'Edit task' : 'Create task'}</h2><div className="small muted">Attach it to a client or keep it general.</div></div>
            <div className="toolbar compact-toolbar wrap-row">
              {!editingId && form.title ? <span className="pill small-pill">Draft saved</span> : null}
              {editingId ? <button className="button secondary" onClick={resetForm} type="button">Cancel</button> : null}
            </div>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder="Task title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
            <textarea className="textarea" placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={4} />
            <select className="select" value={form.clientId} onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))}><option value="">General task</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select>
            <select className="select" value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select>
            <select className="select" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as TaskStatus }))}><option value="todo">todo</option><option value="in_progress">in progress</option><option value="done">done</option></select>
            <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} />
            <button className="button" disabled={createMutation.isPending || updateMutation.isPending}>{editingId ? 'Save changes' : 'Save task'}</button>
          </form>
        </div>

        <div className="card card-pad">
          <div className="card-title-row stack-on-mobile">
            <div><h2 style={{ margin: 0 }}>{viewMode === 'kanban' ? 'Kanban workflow' : 'Task list'}</h2><div className="small muted">Filter, sort, select multiple items, edit inline or drag cards.</div></div>
            <label className="button secondary" style={{ cursor: 'pointer' }}>Import CSV<input type="file" accept=".csv" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleImportFile(e.target.files[0])} /></label>
          </div>

          <div className="toolbar toolbar-stack-mobile wrap-row" style={{ marginBottom: 16 }}>
            <select className="select compact-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | TaskStatus)}><option value="all">All statuses</option><option value="todo">Todo</option><option value="in_progress">In progress</option><option value="done">Done</option></select>
            <select className="select compact-control" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as 'all' | TaskPriority)}><option value="all">All priorities</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
            <select className="select compact-control" value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}><option value="dueDate">Due date</option><option value="priority">Priority</option><option value="newest">Newest</option></select>
            <div className="pill">↔️ Drag cards between columns</div>
          </div>

          {selectedIds.length ? <div className="toolbar wrap-row bulk-bar"><span className="pill">{selectedIds.length} selected</span><button className="button secondary" type="button" onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: 'in_progress' })}>Move to in progress</button><button className="button secondary" type="button" onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: 'done' })}>Mark done</button><button className="button danger" type="button" onClick={confirmBulkDelete}>Delete selected</button></div> : null}
          {isLoading ? <LoadingBlock lines={5} /> : null}
          {isError ? <div className="empty-state premium-empty-state"><strong>Could not load tasks.</strong><div className="small muted">Try refreshing the page.</div></div> : null}

          {viewMode === 'list' ? (
            <div className="mobile-card-list">
              {tasksWithClient.map((task) => (
                <article key={task.id} className="mobile-list-card">
                  <div className="mobile-list-row">
                    <label className="checkbox-row"><input type="checkbox" checked={selectedIds.includes(task.id)} onChange={() => toggleSelected(task.id)} aria-label={`Select ${task.title}`} /> <span /></label>
                    <div style={{ flex: 1 }}><strong>{task.title}</strong><div className="small muted">{task.clientName}</div></div>
                    <span className={`badge ${task.priority}`}>{task.priority}</span>
                  </div>
                  <p className="small" style={{ marginTop: 10, marginBottom: 10 }}>{task.description || 'No description yet.'}</p>
                  <div className="mobile-list-row wrap-row">
                    <div className="toolbar compact-toolbar wrap-row"><span className={`badge ${task.status}`}>{task.status.replace('_', ' ')}</span>{task.dueDate ? <span className="pill small-pill">📅 {task.dueDate}</span> : <span className="pill small-pill">No deadline</span>}</div>
                    <div className="toolbar compact-toolbar"><button className="button secondary" onClick={() => startEdit(task)} type="button">Edit</button><button className="button danger" onClick={() => confirmDeleteTask(task.id)} type="button">Delete</button></div>
                  </div>
                </article>
              ))}
              {!isLoading && tasksWithClient.length === 0 ? <div className="empty-state premium-empty-state"><div className="empty-icon">🧩</div><strong>No tasks in this view.</strong><div className="small muted">Create a new task, import CSV, or relax the filters.</div></div> : null}
            </div>
          ) : (
            <div className="kanban-board" aria-label="Kanban board">
              {kanbanBuckets.map((column) => (
                <section key={column.status} className={`kanban-column ${dragOverStatus === column.status ? 'drag-over' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragOverStatus(column.status) }} onDragLeave={() => setDragOverStatus((current) => current === column.status ? null : current)} onDrop={() => handleDrop(column.status)}>
                  <div className="kanban-column-header"><div><div className="small muted">{column.icon} {column.label}</div><h3 style={{ margin: '4px 0 0' }}>{column.items.length} task{column.items.length === 1 ? '' : 's'}</h3></div><span className="pill small-pill">{column.status.replace('_', ' ')}</span></div>
                  <div className="kanban-stack">
                    {column.items.length ? column.items.map((task) => (
                      <article key={task.id} className={`kanban-card ${draggingTaskId === task.id ? 'dragging' : ''}`} draggable onDragStart={() => setDraggingTaskId(task.id)} onDragEnd={() => { setDraggingTaskId(null); setDragOverStatus(null) }}>
                        <div className="mobile-list-row"><strong>{task.title}</strong><span className={`badge ${task.priority}`}>{task.priority}</span></div>
                        <div className="small muted" style={{ marginTop: 8 }}>{task.clientName}</div>
                        <p className="small" style={{ marginTop: 10, marginBottom: 12 }}>{task.description || 'No description yet.'}</p>
                        <div className="mobile-list-row wrap-row"><div className="toolbar compact-toolbar wrap-row"><label className="checkbox-row"><input type="checkbox" checked={selectedIds.includes(task.id)} onChange={() => toggleSelected(task.id)} aria-label={`Select ${task.title}`} /> <span /></label>{task.dueDate ? <span className="pill small-pill">📅 {task.dueDate}</span> : <span className="pill small-pill">No deadline</span>}</div><div className="toolbar compact-toolbar wrap-row"><button className="button secondary" onClick={() => startEdit(task)} type="button">Edit</button><button className="button danger" onClick={() => confirmDeleteTask(task.id)} type="button">Delete</button></div></div>
                      </article>
                    )) : <div className="empty-dropzone"><div className="empty-icon">📥</div><strong>Drop a task here</strong><div className="small muted">Move cards to change workflow status instantly.</div></div>}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
