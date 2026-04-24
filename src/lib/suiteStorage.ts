export type Invoice = {
  id: string
  client: string
  service: string
  amount: number
  status: 'draft' | 'sent' | 'paid'
  dueDate: string
  createdAt: string
}

export type ServiceTemplate = {
  id: string
  name: string
  price: number
  duration: string
  deliverables: string
}

export type TimeEntry = {
  id: string
  client: string
  task: string
  hours: number
  date: string
}

export type PortalItem = {
  id: string
  client: string
  accessCode: string
  status: 'active' | 'preview' | 'paused'
  visibleSections: string[]
}

export type DemoPlan = {
  id: string
  productUrl: string
  style: string
  duration: number
  objective: string
  readiness: number
  shots: string[]
  createdAt: string
}

export type ImpactGoal = {
  id: string
  title: string
  metric: string
  current: number
  target: number
  dueDate: string
}

const seeds = {
  invoices: [
    { id: 'inv-1', client: 'Bloom Studio', service: 'Growth Retainer', amount: 1800, status: 'sent', dueDate: '2026-05-05', createdAt: '2026-04-20' },
    { id: 'inv-2', client: 'Northline Agency', service: 'Analytics Snapshot', amount: 3200, status: 'paid', dueDate: '2026-04-28', createdAt: '2026-04-12' },
    { id: 'inv-3', client: 'PixelCraft', service: 'Web App Discovery', amount: 950, status: 'draft', dueDate: '2026-05-10', createdAt: '2026-04-24' },
  ] as Invoice[],
  services: [
    { id: 'srv-1', name: 'Growth Retainer', price: 1800, duration: 'Monthly', deliverables: 'Strategy, weekly tasks, reports, client check-ins' },
    { id: 'srv-2', name: 'Launch Sprint', price: 2400, duration: '2 weeks', deliverables: 'Landing page, campaign assets, QA checklist' },
    { id: 'srv-3', name: 'Analytics Snapshot', price: 750, duration: '3 days', deliverables: 'KPI review, insights, next actions' },
  ] as ServiceTemplate[],
  time: [
    { id: 'time-1', client: 'Bloom Studio', task: 'Campaign assets', hours: 3.5, date: '2026-04-23' },
    { id: 'time-2', client: 'Northline Agency', task: 'Monthly analytics', hours: 2, date: '2026-04-22' },
    { id: 'time-3', client: 'PixelCraft', task: 'Proposal scope', hours: 1.25, date: '2026-04-24' },
  ] as TimeEntry[],
  portals: [
    { id: 'portal-1', client: 'Bloom Studio', accessCode: 'BLOOM-2026', status: 'active', visibleSections: ['Tasks', 'Invoices', 'Timeline'] },
    { id: 'portal-2', client: 'PixelCraft', accessCode: 'PIXEL-DEMO', status: 'preview', visibleSections: ['Proposal', 'Tasks'] },
  ] as PortalItem[],
  demos: [
    { id: 'demo-1', productUrl: 'https://laurandreea10.github.io/ClientFlow-PRO/#/dashboard', style: 'SaaS Clean', duration: 45, objective: 'Show a polished CRM demo for recruiters', readiness: 94, shots: ['Open login and Try Demo', 'Show AI Copilot recommendations', 'Switch EN/RO', 'Open Client pipeline', 'Export backup JSON'], createdAt: '2026-04-24' },
  ] as DemoPlan[],
  impact: [
    { id: 'goal-1', title: 'Portfolio product completeness', metric: 'Modules shipped', current: 8, target: 12, dueDate: '2026-05-15' },
    { id: 'goal-2', title: 'Recruiter clarity', metric: 'Demo steps documented', current: 5, target: 6, dueDate: '2026-05-01' },
    { id: 'goal-3', title: 'Zero-cost deployability', metric: 'Paid services required', current: 0, target: 0, dueDate: '2026-04-24' },
  ] as ImpactGoal[],
}

const keyMap = {
  invoices: 'clientflow_suite_invoices',
  services: 'clientflow_suite_services',
  time: 'clientflow_suite_time_entries',
  portals: 'clientflow_suite_portals',
  demos: 'clientflow_suite_demo_plans',
  impact: 'clientflow_suite_impact_goals',
} as const

function uid(prefix: string) {
  return crypto.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function readSuiteCollection<Key extends keyof typeof seeds>(key: Key): (typeof seeds)[Key] {
  try {
    const raw = localStorage.getItem(keyMap[key])
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through to seed
  }

  localStorage.setItem(keyMap[key], JSON.stringify(seeds[key]))
  return seeds[key]
}

export function writeSuiteCollection<Key extends keyof typeof seeds>(key: Key, value: (typeof seeds)[Key]) {
  localStorage.setItem(keyMap[key], JSON.stringify(value))
}

export function addSuiteItem<Key extends keyof typeof seeds, Item extends (typeof seeds)[Key][number]>(key: Key, item: Omit<Item, 'id'>) {
  const current = readSuiteCollection(key) as Item[]
  const next = { ...item, id: uid(String(key)) } as Item
  writeSuiteCollection(key, [next, ...current] as (typeof seeds)[Key])
  return next
}

export function updateSuiteItem<Key extends keyof typeof seeds, Item extends (typeof seeds)[Key][number]>(key: Key, id: string, patch: Partial<Item>) {
  const current = readSuiteCollection(key) as Item[]
  const next = current.map((item) => (item.id === id ? { ...item, ...patch } : item))
  writeSuiteCollection(key, next as (typeof seeds)[Key])
}

export function generateDemoPlan(input: Pick<DemoPlan, 'productUrl' | 'style' | 'duration' | 'objective'>): DemoPlan {
  const hasUrl = input.productUrl.startsWith('http')
  const objectiveScore = Math.min(20, input.objective.length)
  const durationScore = input.duration >= 20 && input.duration <= 90 ? 20 : 10
  const readiness = Math.min(100, 45 + (hasUrl ? 25 : 0) + objectiveScore + durationScore)

  return {
    id: uid('demo'),
    ...input,
    readiness,
    createdAt: new Date().toISOString(),
    shots: [
      'Open with a clear product promise',
      'Show the dashboard and strongest KPI',
      'Highlight one workflow end-to-end',
      'Show trust signal: local storage, backup, or PWA',
      'Close with the next best action',
    ],
  }
}
