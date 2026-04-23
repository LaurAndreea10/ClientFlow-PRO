export type ClientStatus = 'lead' | 'active' | 'inactive'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export type Locale = 'en' | 'ro'
export type Theme = 'dark' | 'light'

export interface User {
  id: string
  fullName: string
  email: string
}

export interface Client {
  id: string
  userId: string
  name: string
  company: string
  email: string
  phone: string
  status: ClientStatus
  monthlyValue: number
  createdAt: string
}

export interface Task {
  id: string
  userId: string
  clientId: string | null
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  createdAt: string
}

export interface Note {
  id: string
  userId: string
  clientId: string
  content: string
  createdAt: string
}

export interface DashboardStats {
  totalClients: number
  activeTasks: number
  completedTasks: number
  revenue: number
}

export interface ActivityEntry {
  id: string
  userId: string
  entityType: 'client' | 'task' | 'note' | 'profile' | 'workspace' | 'system'
  entityId?: string
  action: string
  message: string
  createdAt: string
}

export interface NotificationItem {
  id: string
  userId: string
  title: string
  body: string
  type: 'success' | 'info' | 'warning'
  read: boolean
  createdAt: string
}

export interface WorkspaceExport {
  session: User | null
  clients: Client[]
  tasks: Task[]
  notes: Note[]
  activity: ActivityEntry[]
  notifications: NotificationItem[]
  exportedAt: string
}

export interface BackendAdapterInfo {
  mode: 'local'
  readyForSupabase: boolean
  monthlyCostRequired: false
}
