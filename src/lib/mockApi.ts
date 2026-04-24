import type { Client, CustomField, DashboardStats, Note, Subtask, Task, TaskComment, User } from '../types'
import { buildSeed } from '../data/seed'
import {
  AUTH_KEY,
  DEMO_RESET_EVENT,
  DEMO_USER_ID,
  createLocalSession,
  getSession as getAuthSession,
  login as loginWithDemoCredentials,
  logout as clearAuthSession,
} from '../auth/demoAuth'
import { readStorage, writeStorage } from './storage'

const CLIENTS_KEY = 'clientflow_clients'
const TASKS_KEY = 'clientflow_tasks'
const NOTES_KEY = 'clientflow_notes'

function getUserId() {
  return getSession()?.id ?? 'guest'
}

function createId(prefix: string) {
  return crypto.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function calculateHealthScore(client: Client) {
  let score = 45
  if (client.status === 'active') score += 25
  if (client.status === 'lead') score += 10
  if (client.monthlyValue >= 1500) score += 15
  if ((client.tags ?? []).length > 0) score += 5
  if (client.lastContactedAt) score += 10
  return Math.min(100, score)
}

function normalizeClient(client: Client): Client {
  const withDefaults: Client = {
    ...client,
    stage: client.stage ?? (client.status === 'lead' ? 'new' : client.status === 'active' ? 'won' : 'paused'),
    tags: client.tags ?? [],
    pinned: client.pinned ?? false,
    archived: client.archived ?? false,
    customFields: client.customFields ?? [],
    lastContactedAt: client.lastContactedAt ?? client.createdAt,
  }

  return {
    ...withDefaults,
    healthScore: client.healthScore ?? calculateHealthScore(withDefaults),
  }
}

function normalizeTask(task: Task): Task {
  return {
    ...task,
    recurrence: task.recurrence ?? 'none',
    tags: task.tags ?? [],
    subtasks: task.subtasks ?? [],
    comments: task.comments ?? [],
    archived: task.archived ?? false,
  }
}

function removeUserData(userId: string) {
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  const notes = readStorage<Note[]>(NOTES_KEY, [])

  writeStorage(CLIENTS_KEY, clients.filter((item) => item.userId !== userId))
  writeStorage(TASKS_KEY, tasks.filter((item) => item.userId !== userId))
  writeStorage(NOTES_KEY, notes.filter((item) => item.userId !== userId))
}

function seedUserWorkspace(userId: string) {
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  const notes = readStorage<Note[]>(NOTES_KEY, [])
  const seed = buildSeed(userId)

  writeStorage(CLIENTS_KEY, [...clients, ...seed.clients.map(normalizeClient)])
  writeStorage(TASKS_KEY, [...tasks, ...seed.tasks.map(normalizeTask)])
  writeStorage(NOTES_KEY, [...notes, ...seed.notes])
}

function ensureSeeded(userId: string) {
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  const hasUserData = clients.some((item) => item.userId === userId)

  if (!hasUserData) {
    seedUserWorkspace(userId)
  }
}

export function getSession(): User | null {
  return getAuthSession()
}

export async function login(email: string, password: string) {
  try {
    const demoUser = loginWithDemoCredentials(email, password)
    ensureSeeded(demoUser.id)
    return demoUser
  } catch {
    const user = createLocalSession(email)
    writeStorage(AUTH_KEY, user)
    ensureSeeded(user.id)
    return user
  }
}

export async function register(fullName: string, email: string, _password: string) {
  const user = createLocalSession(email, fullName)
  writeStorage(AUTH_KEY, user)
  ensureSeeded(user.id)
  return user
}

export async function logout() {
  clearAuthSession()
}

export async function resetDemoWorkspace() {
  removeUserData(DEMO_USER_ID)
  seedUserWorkspace(DEMO_USER_ID)
  window.dispatchEvent(new Event(DEMO_RESET_EVENT))
  return true
}

export async function getClients() {
  const userId = getUserId()
  return readStorage<Client[]>(CLIENTS_KEY, []).filter((item) => item.userId === userId).map(normalizeClient)
}

export async function createClient(payload: Omit<Client, 'id' | 'createdAt' | 'userId'>) {
  const userId = getUserId()
  const next: Client = normalizeClient({
    ...payload,
    id: createId('client'),
    userId,
    createdAt: new Date().toISOString(),
  })
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  writeStorage(CLIENTS_KEY, [next, ...clients])
  return next
}

export async function updateClient(id: string, payload: Partial<Client>) {
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  let updated: Client | null = null
  const next = clients.map((item) => {
    if (item.id !== id) return item
    updated = normalizeClient({ ...item, ...payload })
    return updated
  })
  writeStorage(CLIENTS_KEY, next)
  if (!updated) throw new Error('Client not found')
  return updated
}

export async function deleteClient(id: string) {
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  const notes = readStorage<Note[]>(NOTES_KEY, [])
  writeStorage(CLIENTS_KEY, clients.filter((item) => item.id !== id))
  writeStorage(TASKS_KEY, tasks.filter((item) => item.clientId !== id))
  writeStorage(NOTES_KEY, notes.filter((item) => item.clientId !== id))
  return true
}

export async function archiveClient(id: string) {
  return updateClient(id, { archived: true })
}

export async function restoreClient(id: string) {
  return updateClient(id, { archived: false })
}

export async function toggleClientPinned(id: string) {
  const clients = await getClients()
  const client = clients.find((item) => item.id === id)
  if (!client) throw new Error('Client not found')
  return updateClient(id, { pinned: !client.pinned })
}

export async function addClientCustomField(clientId: string, label: string, value: string) {
  const clients = await getClients()
  const client = clients.find((item) => item.id === clientId)
  if (!client) throw new Error('Client not found')
  const customFields: CustomField[] = [...(client.customFields ?? []), { id: createId('field'), label, value }]
  return updateClient(clientId, { customFields })
}

export async function markClientContacted(clientId: string) {
  return updateClient(clientId, { lastContactedAt: new Date().toISOString() })
}

export async function getTasks() {
  const userId = getUserId()
  return readStorage<Task[]>(TASKS_KEY, []).filter((item) => item.userId === userId).map(normalizeTask)
}

export async function createTask(payload: Omit<Task, 'id' | 'createdAt' | 'userId'>) {
  const userId = getUserId()
  const next: Task = normalizeTask({
    ...payload,
    id: createId('task'),
    userId,
    createdAt: new Date().toISOString(),
  })
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  writeStorage(TASKS_KEY, [next, ...tasks])
  return next
}

export async function updateTask(id: string, payload: Partial<Task>) {
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  let updated: Task | null = null
  const next = tasks.map((item) => {
    if (item.id !== id) return item
    updated = normalizeTask({ ...item, ...payload })
    return updated
  })
  writeStorage(TASKS_KEY, next)
  if (!updated) throw new Error('Task not found')
  return updated
}

export async function deleteTask(id: string) {
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  writeStorage(TASKS_KEY, tasks.filter((item) => item.id !== id))
  return true
}

export async function archiveTask(id: string) {
  return updateTask(id, { archived: true })
}

export async function restoreTask(id: string) {
  return updateTask(id, { archived: false })
}

export async function addSubtask(taskId: string, title: string) {
  const tasks = await getTasks()
  const task = tasks.find((item) => item.id === taskId)
  if (!task) throw new Error('Task not found')
  const subtasks: Subtask[] = [...(task.subtasks ?? []), { id: createId('subtask'), title, done: false }]
  return updateTask(taskId, { subtasks })
}

export async function toggleSubtask(taskId: string, subtaskId: string) {
  const tasks = await getTasks()
  const task = tasks.find((item) => item.id === taskId)
  if (!task) throw new Error('Task not found')
  const subtasks = (task.subtasks ?? []).map((subtask) =>
    subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask,
  )
  return updateTask(taskId, { subtasks })
}

export async function addTaskComment(taskId: string, content: string) {
  const tasks = await getTasks()
  const task = tasks.find((item) => item.id === taskId)
  if (!task) throw new Error('Task not found')
  const comments: TaskComment[] = [
    ...(task.comments ?? []),
    { id: createId('comment'), author: getSession()?.fullName ?? 'Demo User', content, createdAt: new Date().toISOString() },
  ]
  return updateTask(taskId, { comments })
}

export async function getNotes(clientId: string) {
  const userId = getUserId()
  return readStorage<Note[]>(NOTES_KEY, []).filter((item) => item.userId === userId && item.clientId === clientId)
}

export async function createNote(clientId: string, content: string) {
  const userId = getUserId()
  const next: Note = {
    id: createId('note'),
    userId,
    clientId,
    content,
    createdAt: new Date().toISOString(),
  }
  const notes = readStorage<Note[]>(NOTES_KEY, [])
  writeStorage(NOTES_KEY, [next, ...notes])
  return next
}

export async function getClientById(id: string) {
  const clients = await getClients()
  return clients.find((item) => item.id === id) ?? null
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const clients = (await getClients()).filter((client) => !client.archived)
  const tasks = (await getTasks()).filter((task) => !task.archived)
  const totalClients = clients.length
  const activeTasks = tasks.filter((item) => item.status !== 'done').length
  const completedTasks = tasks.filter((item) => item.status === 'done').length
  const revenue = clients.reduce((sum, client) => sum + client.monthlyValue, 0)
  return { totalClients, activeTasks, completedTasks, revenue }
}
