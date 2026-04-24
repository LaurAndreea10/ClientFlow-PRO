import { getClients, getTasks } from './mockApi'
import {
  addSuiteItem,
  readSuiteCollection,
  updateSuiteItem,
  type AutomationRule,
  type NotificationItem,
} from './suiteStorage'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function tomorrow() {
  return new Date(Date.now() + 86400000).toISOString().slice(0, 10)
}

export async function runAutomationRule(rule: AutomationRule) {
  const notifications: Omit<NotificationItem, 'id'>[] = []
  const tasks = await getTasks()
  const clients = await getClients()
  const invoices = readSuiteCollection('invoices')
  const bookings = readSuiteCollection('beauty')

  if (rule.trigger === 'overdue-task') {
    tasks
      .filter((task) => !task.archived && task.status !== 'done' && task.dueDate && task.dueDate < today())
      .slice(0, 3)
      .forEach((task) => notifications.push({ title: 'Overdue task', message: `${task.title} is overdue and needs attention.`, type: 'task', read: false, createdAt: new Date().toISOString() }))
  }

  if (rule.trigger === 'invoice-sent') {
    invoices
      .filter((invoice) => invoice.status === 'sent')
      .forEach((invoice) => notifications.push({ title: 'Invoice follow-up', message: `${invoice.client} has a sent invoice for €${invoice.amount}.`, type: 'invoice', read: false, createdAt: new Date().toISOString() }))
  }

  if (rule.trigger === 'beauty-booking-tomorrow') {
    bookings
      .filter((booking) => booking.date === tomorrow() && booking.status !== 'completed')
      .forEach((booking) => notifications.push({ title: 'Beauty booking reminder', message: `${booking.client} has ${booking.service} tomorrow at ${booking.time}.`, type: 'booking', read: false, createdAt: new Date().toISOString() }))
  }

  if (rule.trigger === 'vip-inactive') {
    bookings
      .filter((booking) => booking.retentionLabel === 'VIP' || booking.retentionLabel === 'At risk')
      .forEach((booking) => notifications.push({ title: 'Retention alert', message: `${booking.client} is marked ${booking.retentionLabel}. Schedule a follow-up.`, type: 'client', read: false, createdAt: new Date().toISOString() }))
  }

  if (rule.trigger === 'high-value-lead') {
    clients
      .filter((client) => client.status === 'lead' && client.monthlyValue >= 1500)
      .forEach((client) => notifications.push({ title: 'High-value lead', message: `${client.name} / ${client.company} is worth €${client.monthlyValue}/month. Prepare a proposal.`, type: 'client', read: false, createdAt: new Date().toISOString() }))
  }

  notifications.forEach((notification) => addSuiteItem('notifications', notification))
  updateSuiteItem('automations', rule.id, { lastRunAt: new Date().toISOString() })
  return notifications.length
}

export async function runAllEnabledAutomations() {
  const rules = readSuiteCollection('automations').filter((rule) => rule.enabled)
  let created = 0

  for (const rule of rules) {
    created += await runAutomationRule(rule)
  }

  return created
}
