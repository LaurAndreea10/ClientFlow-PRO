export type ClientStatus = 'lead' | 'active' | 'inactive'
export type ClientStage = 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'paused'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export type RecurrenceRule = 'none' | 'daily' | 'weekly' | 'monthly'

export interface User {
  id: string
  fullName: string
  email: string
}

export interface CustomField {
  id: string
  label: string
  value: string
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
  stage?: ClientStage
  healthScore?: number
  tags?: string[]
  pinned?: boolean
  archived?: boolean
  lastContactedAt?: string
  customFields?: CustomField[]
}

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface TaskComment {
  id: string
  author: string
  content: string
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
  recurrence?: RecurrenceRule
  tags?: string[]
  subtasks?: Subtask[]
  comments?: TaskComment[]
  archived?: boolean
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