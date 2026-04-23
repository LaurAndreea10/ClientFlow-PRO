import type { Client, Note, Task } from '../types'
import { uid } from '../lib/storage'

export function buildSeed(userId: string) {
  const clients: Client[] = [
    {
      id: uid('client'),
      userId,
      name: 'Ana Popescu',
      company: 'Bloom Studio',
      email: 'ana@bloomstudio.ro',
      phone: '+40 700 111 222',
      status: 'active',
      monthlyValue: 900,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('client'),
      userId,
      name: 'Radu Ionescu',
      company: 'PixelCraft',
      email: 'radu@pixelcraft.ro',
      phone: '+40 700 333 444',
      status: 'lead',
      monthlyValue: 450,
      createdAt: new Date().toISOString(),
    },
  ]

  const tasks: Task[] = [
    {
      id: uid('task'),
      userId,
      clientId: clients[0].id,
      title: 'Prepare April campaign assets',
      description: 'Landing visuals, ad copy, and mobile variants.',
      status: 'in_progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('task'),
      userId,
      clientId: clients[1].id,
      title: 'Send proposal and pricing',
      description: 'Share package options and timeline.',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('task'),
      userId,
      clientId: clients[0].id,
      title: 'Review onboarding form',
      description: 'Check required fields and update copy.',
      status: 'done',
      priority: 'low',
      dueDate: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    },
  ]

  const notes: Note[] = [
    {
      id: uid('note'),
      userId,
      clientId: clients[0].id,
      content: 'Discussed Q2 priorities and approved the first concept direction.',
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('note'),
      userId,
      clientId: clients[0].id,
      content: 'Need final logo exports before social media launch.',
      createdAt: new Date().toISOString(),
    },
  ]

  return { clients, tasks, notes }
}