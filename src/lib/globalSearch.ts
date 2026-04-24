import { getClients, getTasks } from './mockApi'
import { readSuiteCollection } from './suiteStorage'

export type GlobalSearchResult = {
  id: string
  type: string
  title: string
  description: string
  href: string
}

export async function getGlobalSearchResults(query: string): Promise<GlobalSearchResult[]> {
  const term = query.toLowerCase().trim()
  const clients = await getClients()
  const tasks = await getTasks()
  const invoices = readSuiteCollection('invoices')
  const services = readSuiteCollection('services')
  const bookings = readSuiteCollection('beauty')
  const demos = readSuiteCollection('demos')
  const impact = readSuiteCollection('impact')

  const results: GlobalSearchResult[] = [
    ...clients.map((item) => ({ id: item.id, type: 'Client', title: item.name, description: `${item.company} · ${item.status}`, href: `/clients/${item.id}` })),
    ...tasks.map((item) => ({ id: item.id, type: 'Task', title: item.title, description: `${item.status} · ${item.priority}`, href: '/tasks' })),
    ...invoices.map((item) => ({ id: item.id, type: 'Invoice', title: item.client, description: `${item.service} · €${item.amount} · ${item.status}`, href: '/invoices' })),
    ...services.map((item) => ({ id: item.id, type: 'Service', title: item.name, description: `€${item.price} · ${item.duration}`, href: '/services' })),
    ...bookings.map((item) => ({ id: item.id, type: 'Booking', title: item.client, description: `${item.service} · ${item.date} ${item.time}`, href: '/beauty' })),
    ...demos.map((item) => ({ id: item.id, type: 'Demo Plan', title: item.style, description: `${item.readiness}/100 · ${item.objective}`, href: '/demo-planner' })),
    ...impact.map((item) => ({ id: item.id, type: 'Impact', title: item.title, description: `${item.current}/${item.target} · ${item.metric}`, href: '/impact' })),
  ]

  if (!term) return results.slice(0, 12)

  return results.filter((item) => `${item.type} ${item.title} ${item.description}`.toLowerCase().includes(term)).slice(0, 30)
}
