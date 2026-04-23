import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../features/toast/ToastContext'
import { bulkDeleteTasks, bulkUpdateTasksStatus, createTask, deleteTask, duplicateTask, getClients, getTasks, importTasksCsv, restoreDeletedTask, saveTaskView, updateTask } from '../lib/mockApi'
import type { Task, TaskPriority, TaskRecurrence, TaskStatus } from '../types'
import { LoadingBlock } from '../components/ui/LoadingBlock'
import { clearDraft, readDraft, writeDraft } from '../lib/uiState'

const defaultForm = { title: '', description: '', clientId: '', status: 'todo' as TaskStatus, priority: 'medium' as TaskPriority, dueDate: '', recurrence: 'none' as TaskRecurrence, tags: '', subtasks: '', attachments: '' }
const TASK_FORM_DRAFT = 'clientflow_draft_task_form'

export function TasksPage() {
  const queryClient = useQueryClient()
  const { pushToast } = useToast()
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all')
  const [archiveFilter, setArchiveFilter] = useState<'active' | 'archived' | 'all'>('active')
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'newest'>('dueDate')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null)
  const [savedViewName, setSavedViewName] = useState('')
  const [form, setForm] = useState(() => readDraft(TASK_FORM_DRAFT, defaultForm))

  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: tasks = [], isLoading, isError } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  useEffect(() => { if (!editingId) writeDraft(TASK_FORM_DRAFT, form) }, [form, editingId])
  const refresh = () => { ['tasks','dashboard','reports','calendar','activity','notifications'].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] })) }

  const createMutation = useMutation({ mutationFn: createTask, onSuccess: () => { refresh(); setForm(defaultForm); clearDraft(TASK_FORM_DRAFT); pushToast('Task created', 'success') } })
  const updateMutation = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<Task> }) => updateTask(id, payload), onSuccess: () => { refresh(); setEditingId(null); setForm(defaultForm); clearDraft(TASK_FORM_DRAFT); pushToast('Task updated', 'success') } })
  const deleteMutation = useMutation({ mutationFn: deleteTask, onSuccess: (task) => { refresh(); pushToast({ title: 'Task deleted', type: 'warning', action: { label: 'Undo', onClick: async () => { await restoreDeletedTask(task); refresh() } } }) } })
  const bulkDeleteMutation = useMutation({ mutationFn: bulkDeleteTasks, onSuccess: () => { refresh(); setSelectedIds([]); pushToast('Selected tasks deleted', 'warning') } })
  const bulkStatusMutation = useMutation({ mutationFn: ({ ids, status }: { ids: string[]; status: TaskStatus }) => bulkUpdateTasksStatus(ids, status), onSuccess: () => { refresh(); setSelectedIds([]); pushToast('Bulk status updated', 'success') } })
  const importMutation = useMutation({ mutationFn: importTasksCsv, onSuccess: (count) => { refresh(); pushToast(`${count} tasks imported`, 'success') } })
  const duplicateMutation = useMutation({ mutationFn: duplicateTask, onSuccess: () => { refresh(); pushToast('Task duplicated', 'info') } })

  const tasksWithClient = useMemo(() => {
    const priorityScore: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 }
    const list = tasks
      .filter((task) => (statusFilter === 'all' ? true : task.status === statusFilter))
      .filter((task) => (priorityFilter === 'all' ? true : task.priority === priorityFilter))
      .filter((task) => archiveFilter === 'all' ? true : archiveFilter === 'archived' ? task.isArchived : !task.isArchived)
      .map((task) => ({ ...task, clientName: clients.find((client) => client.id === task.clientId)?.name ?? 'General' }))
    if (sortBy === 'priority') return [...list].sort((a, b) => priorityScore[a.priority] - priorityScore[b.priority])
    if (sortBy === 'newest') return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    return [...list].sort((a, b) => { if (!a.dueDate && !b.dueDate) return 0; if (!a.dueDate) return 1; if (!b.dueDate) return -1; return +new Date(a.dueDate) - +new Date(b.dueDate) })
  }, [tasks, clients, statusFilter, priorityFilter, archiveFilter, sortBy])

  const kanbanBuckets = useMemo(() => ([
    { status: 'todo' as TaskStatus, label: 'To do', icon: '🪜', items: tasksWithClient.filter((task) => task.status === 'todo') },
    { status: 'in_progress' as TaskStatus, label: 'In progress', icon: '⚡', items: tasksWithClient.filter((task) => task.status === 'in_progress') },
    { status: 'done' as TaskStatus, label: 'Done', icon: '🎯', items: tasksWithClient.filter((task) => task.status === 'done') },
  ]), [tasksWithClient])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const payload = {
      title: form.title, description: form.description, clientId: form.clientId || null, status: form.status, priority: form.priority, dueDate: form.dueDate,
      recurrence: form.recurrence, tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean), subtaskTitles: form.subtasks.split('\n').map((line) => line.trim()).filter(Boolean), attachmentNames: form.attachments.split(',').map((item) => item.trim()).filter(Boolean), isArchived: false,
    }
    if (editingId) return updateMutation.mutate({ id: editingId, payload })
    createMutation.mutate(payload)
  }

  function startEdit(task: Task) {
    setEditingId(task.id)
    setForm({ title: task.title, description: task.description, clientId: task.clientId ?? '', status: task.status, priority: task.priority, dueDate: task.dueDate, recurrence: task.recurrence, tags: task.tags.join(', '), subtasks: task.subtaskTitles.join('\n'), attachments: task.attachmentNames.join(', ') })
    setViewMode('list')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() { setEditingId(null); setForm(defaultForm); clearDraft(TASK_FORM_DRAFT) }
  function toggleSelected(id: string) { setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]) }
  function handleDrop(status: TaskStatus) { if (!draggingTaskId) return; updateMutation.mutate({ id: draggingTaskId, payload: { status } }); setDraggingTaskId(null); setDragOverStatus(null) }
  async function handleImportFile(file: File) { const text = await file.text(); importMutation.mutate(text) }
  function confirmDeleteTask(id: string) { if (!window.confirm('Delete this task from the workflow?')) return; deleteMutation.mutate(id) }
  function confirmBulkDelete() { if (!selectedIds.length || !window.confirm(`Delete ${selectedIds.length} selected tasks?`)) return; bulkDeleteMutation.mutate(selectedIds) }
  function saveCurrentView() { if (!savedViewName.trim()) return; saveTaskView(savedViewName.trim()); pushToast('Task view saved locally', 'info'); setSavedViewName('') }

  return (
    <div className="grid page-gap-lg">
      <div className="page-header stack-on-mobile">
        <div><p className="eyebrow">Workflow management</p><h1 className="page-title">Tasks</h1><p className="muted">Track workload, recurring work, subtasks, mock attachments and switch between list and Kanban.</p></div>
        <div className="page-header-actions mobile-full wrap-row"><div className="pill">✅ {tasks.filter((item) => item.status === 'done').length} done</div><div className="pill">🔁 {tasks.filter((item) => item.recurrence !== 'none').length} recurring</div><div className="view-toggle" role="tablist" aria-label="Task views"><button className={`segmented-button ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')} type="button">Kanban</button><button className={`segmented-button ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} type="button">List</button></div></div>
      </div>

      <div className="two-col two-col-equal mobile-reverse">
        <div className="card card-pad sticky-card-mobile">
          <div className="card-title-row stack-on-mobile"><div><h2 style={{ margin: 0 }}>{editingId ? 'Edit task' : 'Create task'}</h2><div className="small muted">Recurring tasks, subtasks and attachment labels stay 100% local.</div></div><div className="toolbar compact-toolbar wrap-row">{!editingId && form.title ? <span className="pill small-pill">Draft saved</span> : null}{editingId ? <button className="button secondary" onClick={resetForm} type="button">Cancel</button> : null}</div></div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder="Task title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
            <textarea className="textarea" placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={4} />
            <select className="select" value={form.clientId} onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))}><option value="">General task</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select>
            <select className="select" value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select>
            <select className="select" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as TaskStatus }))}><option value="todo">todo</option><option value="in_progress">in progress</option><option value="done">done</option></select>
            <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} />
            <select className="select" value={form.recurrence} onChange={(e) => setForm((prev) => ({ ...prev, recurrence: e.target.value as TaskRecurrence }))}><option value="none">no recurrence</option><option value="daily">daily</option><option value="weekly">weekly</option><option value="monthly">monthly</option></select>
            <input className="input" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} />
            <textarea className="textarea" rows={4} placeholder="Subtasks (one per line)" value={form.subtasks} onChange={(e) => setForm((prev) => ({ ...prev, subtasks: e.target.value }))} />
            <input className="input" placeholder="Mock attachments (comma separated)" value={form.attachments} onChange={(e) => setForm((prev) => ({ ...prev, attachments: e.target.value }))} />
            <button className="button" disabled={createMutation.isPending || updateMutation.isPending}>{editingId ? 'Save changes' : 'Save task'}</button>
          </form>
        </div>

        <div className="card card-pad">
          <div className="card-title-row stack-on-mobile"><div><h2 style={{ margin: 0 }}>Task board</h2><div className="small muted">Save local views, run bulk actions, duplicate tasks and archive old work.</div></div><label className="button secondary" style={{ cursor: 'pointer' }}>Import CSV<input type="file" accept=".csv" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleImportFile(e.target.files[0])} /></label></div>
          <div className="toolbar toolbar-stack-mobile wrap-row" style={{ marginBottom: 16 }}>
            <select className="select compact-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | TaskStatus)}><option value="all">All statuses</option><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option></select>
            <select className="select compact-control" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as 'all' | TaskPriority)}><option value="all">All priorities</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
            <select className="select compact-control" value={archiveFilter} onChange={(e) => setArchiveFilter(e.target.value as typeof archiveFilter)}><option value="active">Active only</option><option value="archived">Archived only</option><option value="all">All tasks</option></select>
            <select className="select compact-control" value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}><option value="dueDate">Due date</option><option value="priority">Priority</option><option value="newest">Newest</option></select>
          </div>
          <div className="toolbar wrap-row" style={{ marginBottom: 16 }}><input className="input compact-control" placeholder="Save current view as..." value={savedViewName} onChange={(e) => setSavedViewName(e.target.value)} /><button className="button secondary" type="button" onClick={saveCurrentView}>Save view</button></div>
          {selectedIds.length ? <div className="toolbar wrap-row bulk-bar"><span className="pill">{selectedIds.length} selected</span><button className="button secondary" type="button" onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: 'todo' })}>Move to do</button><button className="button secondary" type="button" onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: 'done' })}>Mark done</button><button className="button danger" type="button" onClick={confirmBulkDelete}>Delete selected</button></div> : null}
          {isLoading ? <LoadingBlock lines={5} /> : null}
          {isError ? <div className="empty-state premium-empty-state"><strong>Could not load tasks.</strong><div className="small muted">Try refreshing the page.</div></div> : null}
          {viewMode === 'kanban' ? <div className="kanban-grid">{kanbanBuckets.map((bucket) => <section key={bucket.status} className={`kanban-column ${dragOverStatus === bucket.status ? 'drag-over' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragOverStatus(bucket.status) }} onDrop={() => handleDrop(bucket.status)} onDragLeave={() => setDragOverStatus((current) => current === bucket.status ? null : current)}><div className="mobile-list-row" style={{ marginBottom: 12 }}><strong>{bucket.icon} {bucket.label}</strong><span className="pill small-pill">{bucket.items.length}</span></div><div className="grid" style={{ gap: 12 }}>{bucket.items.map((task) => <article key={task.id} className="kanban-card" draggable onDragStart={() => setDraggingTaskId(task.id)}><div className="mobile-list-row"><label className="checkbox-row"><input type="checkbox" checked={selectedIds.includes(task.id)} onChange={() => toggleSelected(task.id)} aria-label={`Select ${task.title}`} /> <span /></label><strong>{task.title}</strong></div><div className="small muted" style={{ marginTop: 6 }}>{task.clientName} • {task.priority} • {task.recurrence}</div><div className="toolbar compact-toolbar wrap-row" style={{ marginTop: 8 }}>{task.tags.map((tag) => <span key={tag} className="pill small-pill">#{tag}</span>)}{task.isArchived ? <span className="pill small-pill">archived</span> : null}</div><div className="small muted" style={{ marginTop: 8 }}>{task.subtaskTitles.length} subtasks • {task.attachmentNames.length} attachments</div><div className="toolbar compact-toolbar wrap-row" style={{ marginTop: 10 }}><button className="button secondary" type="button" onClick={() => startEdit(task)}>Edit</button><button className="button secondary" type="button" onClick={() => updateMutation.mutate({ id: task.id, payload: { isArchived: !task.isArchived } })}>{task.isArchived ? 'Unarchive' : 'Archive'}</button><button className="button secondary" type="button" onClick={() => duplicateMutation.mutate(task.id)}>Duplicate</button><button className="button danger" type="button" onClick={() => confirmDeleteTask(task.id)}>Delete</button></div></article>)}</div></section>)}</div> : <div className="mobile-card-list">{tasksWithClient.map((task) => <article key={task.id} className="mobile-list-card"><div className="mobile-list-row"><label className="checkbox-row"><input type="checkbox" checked={selectedIds.includes(task.id)} onChange={() => toggleSelected(task.id)} aria-label={`Select ${task.title}`} /> <span /></label><div style={{ flex: 1 }}><strong>{task.title}</strong><div className="small muted">{task.clientName}</div></div><span className={`badge ${task.status}`}>{task.status.replace('_',' ')}</span></div><div className="small muted" style={{ marginTop: 8 }}>Priority: {task.priority} • Due: {task.dueDate || 'No due date'} • Recurrence: {task.recurrence}</div><div className="toolbar compact-toolbar wrap-row" style={{ marginTop: 10 }}>{task.tags.map((tag) => <span key={tag} className="pill small-pill">#{tag}</span>)}{task.attachmentNames.map((name) => <span key={name} className="pill small-pill">📎 {name}</span>)}</div><div className="small muted" style={{ marginTop: 8 }}>Subtasks: {task.subtaskTitles.join(', ') || 'None'}</div><div className="toolbar compact-toolbar wrap-row" style={{ marginTop: 12 }}><button className="button secondary" onClick={() => startEdit(task)} type="button">Edit</button><button className="button secondary" onClick={() => updateMutation.mutate({ id: task.id, payload: { isArchived: !task.isArchived } })} type="button">{task.isArchived ? 'Unarchive' : 'Archive'}</button><button className="button secondary" onClick={() => duplicateMutation.mutate(task.id)} type="button">Duplicate</button><button className="button danger" onClick={() => confirmDeleteTask(task.id)} type="button">Delete</button></div></article>)}{!isLoading && tasksWithClient.length === 0 ? <div className="empty-state premium-empty-state"><div className="empty-icon">🧩</div><strong>No tasks match this view.</strong><div className="small muted">Create a task, import CSV or adjust filters.</div></div> : null}</div>}
        </div>
      </div>
    </div>
  )
}
