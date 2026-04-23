export type ClientStatus = 'lead' | 'active' | 'inactive'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

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