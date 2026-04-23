import type {
  ActivityEntry,
  BackendAdapterInfo,
  Client,
  DashboardStats,
  Note,
  NotificationItem,
  Task,
  User,
  WorkspaceExport,
} from '../types'
import { buildSeed } from '../data/seed'
import { parseCsv } from './csv'
import { readStorage, uid, writeStorage } from './storage'

const SESSION_KEY = 'clientflow_session'
const CLIENTS_KEY = 'clientflow_clients'
const TASKS_KEY = 'clientflow_tasks'
const CLIENT_VIEWS_KEY = 'clientflow_client_views'
const TASK_VIEWS_KEY = 'clientflow_task_views'
const NOTES_KEY = 'clientflow_notes'
const ACTIVITY_KEY = 'clientflow_activity'
const NOTIFICATIONS_KEY = 'clientflow_notifications'

function getUserId() {
  return getSession()?.id ?? 'guest'
}

function addActivity(entry: Omit<ActivityEntry, 'id' | 'createdAt' | 'userId'>) {
  const userId = getUserId()
  const current = readStorage<ActivityEntry[]>(ACTIVITY_KEY, [])
  const next: ActivityEntry = {
    id: uid('activity'),
    userId,
    createdAt: new Date().toISOString(),
    ...entry,
  }
  writeStorage(ACTIVITY_KEY, [next, ...current])
  return next
}

function pushNotification(input: Omit<NotificationItem, 'id' | 'createdAt' | 'userId' | 'read'>) {
  const userId = getUserId()
  const current = readStorage<NotificationItem[]>(NOTIFICATIONS_KEY, [])
  const next: NotificationItem = {
    id: uid('notice'),
    userId,
    title: input.title,
    body: input.body,
    type: input.type,
    read: false,
    createdAt: new Date().toISOString(),
  }
  writeStorage(NOTIFICATIONS_KEY, [next, ...current].slice(0, 30))
  return next
}

function ensureSeeded(userId: string) {
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  const notes = readStorage<Note[]>(NOTES_KEY, [])

  const hasUserData = clients.some((item) => item.userId === userId)
  if (!hasUserData) {
    const seed = buildSeed(userId)
    writeStorage(CLIENTS_KEY, [...clients, ...seed.clients])
    writeStorage(TASKS_KEY, [...tasks, ...seed.tasks])
    writeStorage(NOTES_KEY, [...notes, ...seed.notes])
    addActivity({ entityType: 'workspace', action: 'seeded', message: 'Demo workspace was initialized.' })
  }
}

export function getSession(): User | null {
  return readStorage<User | null>(SESSION_KEY, null)
}

export async function login(email: string, _password: string) {
  const user: User = {
    id: uid('user'),
    email,
    fullName: email.split('@')[0].replace(/[._-]/g, ' '),
  }
  writeStorage(SESSION_KEY, user)
  ensureSeeded(user.id)
  addActivity({ entityType: 'system', action: 'login', message: `${user.fullName} signed in.` })
  pushNotification({ title: 'Signed in', body: 'Your local workspace is ready.', type: 'success' })
  return user
}

export async function register(fullName: string, email: string, _password: string) {
  const user: User = { id: uid('user'), email, fullName }
  writeStorage(SESSION_KEY, user)
  ensureSeeded(user.id)
  addActivity({ entityType: 'system', action: 'register', message: `${fullName} created a local account.` })
  pushNotification({ title: 'Account created', body: 'You can start using the demo right away.', type: 'success' })
  return user
}

export async function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getBackendAdapterInfo(): BackendAdapterInfo {
  return { mode: 'local', readyForSupabase: true, monthlyCostRequired: false }
}

export async function getClients() {
  const userId = getUserId()
  return readStorage<Client[]>(CLIENTS_KEY, []).filter((item) => item.userId === userId)
}

export async function createClient(payload: Omit<Client, 'id' | 'createdAt' | 'userId'>) {
  const userId = getUserId()
  const next: Client = { ...payload, tags: payload.tags ?? [], isFavorite: payload.isFavorite ?? false, isArchived: payload.isArchived ?? false, id: uid('client'), userId, createdAt: new Date().toISOString() }
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  writeStorage(CLIENTS_KEY, [next, ...clients])
  addActivity({ entityType: 'client', entityId: next.id, action: 'created', message: `Client ${next.name} was created.` })
  pushNotification({ title: 'Client added', body: `${next.name} is now in your pipeline.`, type: 'success' })
  return next
}

export async function updateClient(id: string, payload: Partial<Client>) {
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  let updated: Client | null = null
  const next = clients.map((item) => {
    if (item.id !== id) return item
    updated = { ...item, ...payload }
    return updated
  })
  writeStorage(CLIENTS_KEY, next)
  if (!updated) throw new Error('Client not found')
  const clientUpdated = updated as Client
  addActivity({ entityType: 'client', entityId: id, action: 'updated', message: `Client ${clientUpdated.name} was updated.` })
  return clientUpdated
}

export async function deleteClient(id: string) {
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  const target = clients.find((item) => item.id === id) ?? null
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  const notes = readStorage<Note[]>(NOTES_KEY, [])
  const removedTasks = tasks.filter((item) => item.clientId === id)
  const removedNotes = notes.filter((item) => item.clientId === id)
  writeStorage(CLIENTS_KEY, clients.filter((item) => item.id !== id))
  writeStorage(TASKS_KEY, tasks.filter((item) => item.clientId !== id))
  writeStorage(NOTES_KEY, notes.filter((item) => item.clientId !== id))
  addActivity({ entityType: 'client', entityId: id, action: 'deleted', message: `Client ${target?.name ?? id} was deleted.` })
  pushNotification({ title: 'Client deleted', body: 'Related tasks and notes were also removed.', type: 'warning' })
  return { client: target, tasks: removedTasks, notes: removedNotes }
}

export async function restoreDeletedClient(payload: { client: Client | null; tasks: Task[]; notes: Note[] }) {
  if (!payload.client) return false
  writeStorage(CLIENTS_KEY, [payload.client, ...readStorage<Client[]>(CLIENTS_KEY, [])])
  writeStorage(TASKS_KEY, [...payload.tasks, ...readStorage<Task[]>(TASKS_KEY, [])])
  writeStorage(NOTES_KEY, [...payload.notes, ...readStorage<Note[]>(NOTES_KEY, [])])
  addActivity({ entityType: 'client', entityId: payload.client.id, action: 'restored', message: `Client ${payload.client.name} was restored.` })
  pushNotification({ title: 'Client restored', body: `${payload.client.name} is back in the workspace.`, type: 'info' })
  return true
}

export async function bulkDeleteClients(ids: string[]) {
  await Promise.all(ids.map((id) => deleteClient(id)))
  addActivity({ entityType: 'client', action: 'bulk_deleted', message: `${ids.length} clients were removed.` })
  return true
}

export async function bulkUpdateClientsStatus(ids: string[], status: Client['status']) {
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  const next = clients.map((client) => (ids.includes(client.id) ? { ...client, status } : client))
  writeStorage(CLIENTS_KEY, next)
  addActivity({ entityType: 'client', action: 'bulk_status', message: `${ids.length} clients changed to ${status}.` })
  return true
}

export async function importClientsCsv(csvText: string) {
  const rows = parseCsv(csvText)
  let count = 0
  for (const row of rows) {
    if (!row.name || !row.company || !row.email) continue
    await createClient({
      name: row.name,
      company: row.company,
      email: row.email,
      phone: row.phone ?? '',
      status: (row.status as Client['status']) || 'lead',
      monthlyValue: Number(row.monthlyValue ?? 0),
      tags: row.tags ? String(row.tags).split('|').filter(Boolean) : [],
      isFavorite: false,
      isArchived: false,
      notesTemplate: row.notesTemplate ? String(row.notesTemplate) : '',
    })
    count += 1
  }
  addActivity({ entityType: 'client', action: 'imported_csv', message: `${count} clients were imported from CSV.` })
  pushNotification({ title: 'CSV imported', body: `${count} clients were added.`, type: 'success' })
  return count
}

export async function getTasks() {
  const userId = getUserId()
  return readStorage<Task[]>(TASKS_KEY, []).filter((item) => item.userId === userId)
}

export async function createTask(payload: Omit<Task, 'id' | 'createdAt' | 'userId'>) {
  const userId = getUserId()
  const next: Task = { ...payload, recurrence: payload.recurrence ?? 'none', tags: payload.tags ?? [], subtaskTitles: payload.subtaskTitles ?? [], attachmentNames: payload.attachmentNames ?? [], isArchived: payload.isArchived ?? false, id: uid('task'), userId, createdAt: new Date().toISOString() }
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  writeStorage(TASKS_KEY, [next, ...tasks])
  addActivity({ entityType: 'task', entityId: next.id, action: 'created', message: `Task ${next.title} was created.` })
  if (next.priority === 'high') {
    pushNotification({ title: 'High priority task', body: `${next.title} needs extra attention.`, type: 'warning' })
  }
  return next
}

export async function updateTask(id: string, payload: Partial<Task>) {
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  let updated: Task | null = null
  const next = tasks.map((item) => {
    if (item.id !== id) return item
    updated = { ...item, ...payload }
    return updated
  })
  writeStorage(TASKS_KEY, next)
  if (!updated) throw new Error('Task not found')
  const taskUpdated = updated as Task
  addActivity({ entityType: 'task', entityId: id, action: 'updated', message: `Task ${taskUpdated.title} was updated.` })
  return taskUpdated
}

export async function deleteTask(id: string) {
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  const target = tasks.find((item) => item.id === id) ?? null
  writeStorage(TASKS_KEY, tasks.filter((item) => item.id !== id))
  addActivity({ entityType: 'task', entityId: id, action: 'deleted', message: `Task ${target?.title ?? id} was deleted.` })
  return target
}

export async function restoreDeletedTask(task: Task | null) {
  if (!task) return false
  writeStorage(TASKS_KEY, [task, ...readStorage<Task[]>(TASKS_KEY, [])])
  addActivity({ entityType: 'task', entityId: task.id, action: 'restored', message: `Task ${task.title} was restored.` })
  pushNotification({ title: 'Task restored', body: `${task.title} is back in the workflow.`, type: 'info' })
  return true
}

export async function bulkDeleteTasks(ids: string[]) {
  await Promise.all(ids.map((id) => deleteTask(id)))
  addActivity({ entityType: 'task', action: 'bulk_deleted', message: `${ids.length} tasks were removed.` })
  return true
}

export async function bulkUpdateTasksStatus(ids: string[], status: Task['status']) {
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  const next = tasks.map((task) => (ids.includes(task.id) ? { ...task, status } : task))
  writeStorage(TASKS_KEY, next)
  addActivity({ entityType: 'task', action: 'bulk_status', message: `${ids.length} tasks changed to ${status}.` })
  pushNotification({ title: 'Bulk task update', body: `${ids.length} tasks moved to ${status.replace('_', ' ')}.`, type: 'info' })
  return true
}

export async function importTasksCsv(csvText: string) {
  const rows = parseCsv(csvText)
  let count = 0
  for (const row of rows) {
    if (!row.title) continue
    await createTask({
      title: row.title,
      description: row.description ?? '',
      clientId: row.clientId || null,
      status: (row.status as Task['status']) || 'todo',
      priority: (row.priority as Task['priority']) || 'medium',
      dueDate: row.dueDate ?? '',
      recurrence: (row.recurrence as Task['recurrence']) || 'none',
      tags: row.tags ? String(row.tags).split('|').filter(Boolean) : [],
      subtaskTitles: row.subtaskTitles ? String(row.subtaskTitles).split('|').filter(Boolean) : [],
      attachmentNames: row.attachmentNames ? String(row.attachmentNames).split('|').filter(Boolean) : [],
      isArchived: false,
    })
    count += 1
  }
  addActivity({ entityType: 'task', action: 'imported_csv', message: `${count} tasks were imported from CSV.` })
  return count
}

export async function getNotes(clientId: string) {
  const userId = getUserId()
  return readStorage<Note[]>(NOTES_KEY, []).filter((item) => item.userId === userId && item.clientId === clientId)
}

export async function createNote(clientId: string, content: string) {
  const userId = getUserId()
  const next: Note = {
    id: uid('note'),
    userId,
    clientId,
    content,
    createdAt: new Date().toISOString(),
  }
  const notes = readStorage<Note[]>(NOTES_KEY, [])
  writeStorage(NOTES_KEY, [next, ...notes])
  addActivity({ entityType: 'note', entityId: next.id, action: 'created', message: 'A client note was added.' })
  pushNotification({ title: 'New note added', body: 'The client timeline has new activity.', type: 'info' })
  return next
}

export async function getClientById(id: string) {
  const clients = await getClients()
  return clients.find((item) => item.id === id) ?? null
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const clients = (await getClients()).filter((item) => !item.isArchived)
  const tasks = (await getTasks()).filter((item) => !item.isArchived)
  const totalClients = clients.length
  const activeTasks = tasks.filter((item) => item.status !== 'done').length
  const completedTasks = tasks.filter((item) => item.status === 'done').length
  const revenue = clients.reduce((sum, client) => sum + client.monthlyValue, 0)
  return { totalClients, activeTasks, completedTasks, revenue }
}

export async function getActivity() {
  const userId = getUserId()
  return readStorage<ActivityEntry[]>(ACTIVITY_KEY, []).filter((item) => item.userId === userId)
}

export async function getNotifications() {
  const userId = getUserId()
  return readStorage<NotificationItem[]>(NOTIFICATIONS_KEY, []).filter((item) => item.userId === userId)
}

export async function markAllNotificationsRead() {
  const userId = getUserId()
  const next = readStorage<NotificationItem[]>(NOTIFICATIONS_KEY, []).map((item) => item.userId === userId ? { ...item, read: true } : item)
  writeStorage(NOTIFICATIONS_KEY, next)
  return true
}


export function getSavedClientViews() {
  return readStorage<string[]>(CLIENT_VIEWS_KEY, ['all'])
}

export function saveClientView(name: string) {
  const current = getSavedClientViews()
  if (current.includes(name)) return current
  const next = [...current, name]
  writeStorage(CLIENT_VIEWS_KEY, next)
  return next
}

export function getSavedTaskViews() {
  return readStorage<string[]>(TASK_VIEWS_KEY, ['all'])
}

export function saveTaskView(name: string) {
  const current = getSavedTaskViews()
  if (current.includes(name)) return current
  const next = [...current, name]
  writeStorage(TASK_VIEWS_KEY, next)
  return next
}

export async function duplicateTask(id: string) {
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  const current = tasks.find((item) => item.id === id)
  if (!current) throw new Error('Task not found')
  return createTask({
    title: `${current.title} copy`,
    description: current.description,
    clientId: current.clientId,
    status: 'todo',
    priority: current.priority,
    dueDate: current.dueDate,
    recurrence: current.recurrence,
    tags: current.tags,
    subtaskTitles: current.subtaskTitles,
    attachmentNames: current.attachmentNames,
    isArchived: false,
  })
}

export async function duplicateClient(id: string) {
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  const current = clients.find((item) => item.id === id)
  if (!current) throw new Error('Client not found')
  return createClient({
    name: `${current.name} copy`,
    company: current.company,
    email: `copy+${current.email}`,
    phone: current.phone,
    status: current.status,
    monthlyValue: current.monthlyValue,
    tags: current.tags,
    isFavorite: current.isFavorite,
    isArchived: false,
    notesTemplate: current.notesTemplate ?? '',
  })
}

export function exportWorkspaceData(): WorkspaceExport {
  const userId = getUserId()
  return {
    session: getSession(),
    clients: readStorage<Client[]>(CLIENTS_KEY, []).filter((item) => item.userId === userId),
    tasks: readStorage<Task[]>(TASKS_KEY, []).filter((item) => item.userId === userId),
    notes: readStorage<Note[]>(NOTES_KEY, []).filter((item) => item.userId === userId),
    activity: readStorage<ActivityEntry[]>(ACTIVITY_KEY, []).filter((item) => item.userId === userId),
    notifications: readStorage<NotificationItem[]>(NOTIFICATIONS_KEY, []).filter((item) => item.userId === userId),
    exportedAt: new Date().toISOString(),
  }
}

export async function importWorkspaceJson(jsonText: string) {
  const payload = JSON.parse(jsonText) as Partial<WorkspaceExport>
  const userId = getUserId()
  if (payload.clients) {
    writeStorage(CLIENTS_KEY, [...readStorage<Client[]>(CLIENTS_KEY, []).filter((item) => item.userId !== userId), ...payload.clients.map((item) => ({ ...item, userId }))])
  }
  if (payload.tasks) {
    writeStorage(TASKS_KEY, [...readStorage<Task[]>(TASKS_KEY, []).filter((item) => item.userId !== userId), ...payload.tasks.map((item) => ({ ...item, userId }))])
  }
  if (payload.notes) {
    writeStorage(NOTES_KEY, [...readStorage<Note[]>(NOTES_KEY, []).filter((item) => item.userId !== userId), ...payload.notes.map((item) => ({ ...item, userId }))])
  }
  addActivity({ entityType: 'workspace', action: 'imported_json', message: 'Workspace data was imported from JSON.' })
  pushNotification({ title: 'Workspace imported', body: 'JSON data replaced the current workspace.', type: 'success' })
  return true
}

export async function updateProfile(fullName: string, email: string) {
  const current = getSession()
  if (!current) throw new Error('No active session')
  const next: User = { ...current, fullName, email }
  writeStorage(SESSION_KEY, next)
  addActivity({ entityType: 'profile', entityId: current.id, action: 'updated', message: 'Profile settings were updated.' })
  return next
}

export async function resetWorkspaceData() {
  const userId = getUserId()
  writeStorage(CLIENTS_KEY, readStorage<Client[]>(CLIENTS_KEY, []).filter((item) => item.userId !== userId))
  writeStorage(TASKS_KEY, readStorage<Task[]>(TASKS_KEY, []).filter((item) => item.userId !== userId))
  writeStorage(NOTES_KEY, readStorage<Note[]>(NOTES_KEY, []).filter((item) => item.userId !== userId))
  writeStorage(ACTIVITY_KEY, readStorage<ActivityEntry[]>(ACTIVITY_KEY, []).filter((item) => item.userId !== userId))
  writeStorage(NOTIFICATIONS_KEY, readStorage<NotificationItem[]>(NOTIFICATIONS_KEY, []).filter((item) => item.userId !== userId))
  ensureSeeded(userId)
  pushNotification({ title: 'Workspace reset', body: 'Fresh seed data is ready again.', type: 'info' })
  return true
}
