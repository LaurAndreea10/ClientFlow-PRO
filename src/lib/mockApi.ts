import type { Client, DashboardStats, Note, Task, User } from '../types'
import { buildSeed } from '../data/seed'
import {
  AUTH_KEY,
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

export async function getClients() {
  const userId = getUserId()
  return readStorage<Client[]>(CLIENTS_KEY, []).filter((item) => item.userId === userId)
}

export async function createClient(payload: Omit<Client, 'id' | 'createdAt' | 'userId'>) {
  const userId = getUserId()
  const next: Client = {
    ...payload,
    id: crypto.randomUUID?.() ?? `client-${Date.now()}`,
    userId,
    createdAt: new Date().toISOString(),
  }
  const clients = readStorage<Client[]>(CLIENTS_KEY, [])
  writeStorage(CLIENTS_KEY, [next, ...clients])
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

export async function getTasks() {
  const userId = getUserId()
  return readStorage<Task[]>(TASKS_KEY, []).filter((item) => item.userId === userId)
}

export async function createTask(payload: Omit<Task, 'id' | 'createdAt' | 'userId'>) {
  const userId = getUserId()
  const next: Task = {
    ...payload,
    id: crypto.randomUUID?.() ?? `task-${Date.now()}`,
    userId,
    createdAt: new Date().toISOString(),
  }
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  writeStorage(TASKS_KEY, [next, ...tasks])
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
  return updated
}

export async function deleteTask(id: string) {
  const tasks = readStorage<Task[]>(TASKS_KEY, [])
  writeStorage(TASKS_KEY, tasks.filter((item) => item.id !== id))
  return true
}

export async function getNotes(clientId: string) {
  const userId = getUserId()
  return readStorage<Note[]>(NOTES_KEY, []).filter((item) => item.userId === userId && item.clientId === clientId)
}

export async function createNote(clientId: string, content: string) {
  const userId = getUserId()
  const next: Note = {
    id: crypto.randomUUID?.() ?? `note-${Date.now()}`,
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
  const clients = await getClients()
  const tasks = await getTasks()
  const totalClients = clients.length
  const activeTasks = tasks.filter((item) => item.status !== 'done').length
  const completedTasks = tasks.filter((item) => item.status === 'done').length
  const revenue = clients.reduce((sum, client) => sum + client.monthlyValue, 0)
  return { totalClients, activeTasks, completedTasks, revenue }
}
