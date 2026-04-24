import type { Client, Task } from '../types'

export type IndustryKey = 'beauty' | 'auto' | 'kineto' | 'psychology' | 'custom'

export type PermissionKey =
  | 'view'
  | 'add'
  | 'edit'
  | 'delete'
  | 'managePermissions'
  | 'validateClientStatus'
  | 'fullAccess'

export type AccessRole = 'admin' | 'employee' | 'new_employee'

export type WorkspaceProfile = {
  id: string
  name: string
  ownerName: string
  ownerEmail: string
  industry: IndustryKey
  customIndustry?: string
  clientLabel: string
  serviceLabel: string
  statusLabels: string[]
  customFields: string[]
  createdAt: string
}

export type TeamAccess = {
  id: string
  name: string
  email: string
  role: AccessRole
  permissions: PermissionKey[]
  inviteLink: string
  status: 'active' | 'pending'
  createdAt: string
}

export const WORKSPACE_KEY = 'clientflow_workspace_profile'
export const TEAM_ACCESS_KEY = 'clientflow_team_access'
export const CURRENT_ACCESS_KEY = 'clientflow_current_access'
const CLIENTS_KEY = 'clientflow_clients'
const TASKS_KEY = 'clientflow_tasks'
const NOTES_KEY = 'clientflow_notes'

export const rolePresets: Record<AccessRole, { label: string; description: string; permissions: PermissionKey[] }> = {
  admin: {
    label: 'Admin',
    description: 'Access total: editează, modifică, șterge, adaugă permisiuni și gestionează echipa.',
    permissions: ['view', 'add', 'edit', 'delete', 'managePermissions', 'validateClientStatus', 'fullAccess'],
  },
  employee: {
    label: 'Angajat',
    description: 'Vizualizează, adaugă și validează status client.',
    permissions: ['view', 'add', 'validateClientStatus'],
  },
  new_employee: {
    label: 'Angajat nou',
    description: 'View only: poate vizualiza workspace-ul fără modificări.',
    permissions: ['view'],
  },
}

export const permissionLabels: Record<PermissionKey, string> = {
  view: 'Vizualizează',
  add: 'Adaugă',
  edit: 'Editează',
  delete: 'Șterge',
  managePermissions: 'Adaugă permisiuni',
  validateClientStatus: 'Validează status client',
  fullAccess: 'Acces total',
}

export const industryTemplates: Record<IndustryKey, Omit<WorkspaceProfile, 'id' | 'name' | 'ownerName' | 'ownerEmail' | 'createdAt'>> = {
  beauty: {
    industry: 'beauty',
    clientLabel: 'Client beauty',
    serviceLabel: 'Serviciu salon',
    statusLabels: ['Programat', 'Confirmat', 'Finalizat', 'VIP follow-up', 'Revenire'],
    customFields: ['Preferințe culoare', 'Stilist preferat', 'Alergii', 'Ultima vizită', 'Tip tratament', 'Buget sesiune'],
  },
  auto: {
    industry: 'auto',
    clientLabel: 'Client service auto',
    serviceLabel: 'Intervenție auto',
    statusLabels: ['Fișă mașină', 'Diagnoză', 'Deviz trimis', 'Reparație în lucru', 'Gata de predare'],
    customFields: ['Marca auto', 'Model', 'Număr înmatriculare', 'Kilometraj', 'Serie VIN', 'Tip intervenție', 'Piese necesare', 'Data predării'],
  },
  kineto: {
    industry: 'kineto',
    clientLabel: 'Pacient kinetoterapie',
    serviceLabel: 'Ședință kineto',
    statusLabels: ['Evaluare inițială', 'Diagnostic funcțional', 'Plan tratament', 'Ședințe în progres', 'Reevaluare'],
    customFields: ['Diagnostic', 'Obiectiv recuperare', 'Contraindicații', 'Plan ședințe', 'Nivel durere', 'Progres mobilitate', 'Recomandări acasă'],
  },
  psychology: {
    industry: 'psychology',
    clientLabel: 'Client psihologie',
    serviceLabel: 'Ședință psihologică',
    statusLabels: ['Intake', 'Consimțământ semnat', 'În terapie', 'Follow-up', 'Închis'],
    customFields: ['Tip ședință', 'Obiectiv terapeutic', 'Consimțământ', 'Frecvență', 'Confidențialitate', 'Plan terapeutic', 'Risc/observații'],
  },
  custom: {
    industry: 'custom',
    clientLabel: 'Client',
    serviceLabel: 'Serviciu',
    statusLabels: ['Nou', 'În lucru', 'În așteptare', 'Finalizat', 'Follow-up'],
    customFields: ['Câmp custom 1', 'Câmp custom 2', 'Câmp custom 3'],
  },
}

const industrySeeds: Record<IndustryKey, { clients: Omit<Client, 'id' | 'userId' | 'createdAt'>[]; tasks: Omit<Task, 'id' | 'userId' | 'createdAt'>[] }> = {
  beauty: {
    clients: [
      { name: 'Mia Flores', company: 'Beauty Studio VIP', email: 'mia@beauty.demo', phone: '+40 700 810 100', status: 'active', monthlyValue: 240, stage: 'won', healthScore: 94, tags: ['VIP', 'balayage'], pinned: true, archived: false, customFields: [{ id: 'stylist', label: 'Stilist preferat', value: 'Elena' }, { id: 'visit', label: 'Ultima vizită', value: '2026-04-20' }] },
      { name: 'Sofia Marin', company: 'Beauty Retention', email: 'sofia@beauty.demo', phone: '+40 700 810 101', status: 'lead', monthlyValue: 85, stage: 'qualified', healthScore: 76, tags: ['nails', 'returning'], pinned: false, archived: false, customFields: [{ id: 'treatment', label: 'Tip tratament', value: 'Nails Signature' }] },
    ],
    tasks: [
      { clientId: null, title: 'Trimite reminder 24h pentru booking VIP', description: 'Confirmă ora, serviciul și preferințele clientei.', status: 'todo', priority: 'high', dueDate: '2026-05-02', recurrence: 'none', tags: ['booking', 'VIP'], subtasks: [], comments: [], archived: false },
      { clientId: null, title: 'Plan retenție după tratament facial', description: 'Pregătește mesaj de follow-up pentru revenire în 4-6 săptămâni.', status: 'in_progress', priority: 'medium', dueDate: '2026-05-08', recurrence: 'monthly', tags: ['retention'], subtasks: [], comments: [], archived: false },
    ],
  },
  auto: {
    clients: [
      { name: 'Andrei Popescu', company: 'VW Golf 7 · B-123-CRM', email: 'andrei@auto.demo', phone: '+40 721 000 111', status: 'active', monthlyValue: 680, stage: 'proposal', healthScore: 82, tags: ['diagnoză', 'deviz'], pinned: true, archived: false, customFields: [{ id: 'marca', label: 'Marca auto', value: 'Volkswagen' }, { id: 'model', label: 'Model', value: 'Golf 7' }, { id: 'km', label: 'Kilometraj', value: '148.000 km' }] },
      { name: 'Ioana Radu', company: 'BMW X3 · CJ-45-FIX', email: 'ioana@auto.demo', phone: '+40 722 000 222', status: 'lead', monthlyValue: 1250, stage: 'qualified', healthScore: 74, tags: ['reparație', 'piese'], pinned: false, archived: false, customFields: [{ id: 'vin', label: 'Serie VIN', value: 'WBAXXXXXDEMO' }, { id: 'interventie', label: 'Tip intervenție', value: 'Frâne + revizie' }] },
    ],
    tasks: [
      { clientId: null, title: 'Finalizează fișa mașinii pentru VW Golf 7', description: 'Completează VIN, kilometraj, simptome și poze înainte de deviz.', status: 'todo', priority: 'high', dueDate: '2026-05-02', recurrence: 'none', tags: ['fișă mașină'], subtasks: [], comments: [], archived: false },
      { clientId: null, title: 'Trimite deviz pentru BMW X3', description: 'Include piese, manoperă, termen reparație și data predării.', status: 'in_progress', priority: 'high', dueDate: '2026-05-04', recurrence: 'none', tags: ['deviz', 'predare'], subtasks: [], comments: [], archived: false },
    ],
  },
  kineto: {
    clients: [
      { name: 'Maria Dumitru', company: 'Recuperare genunchi', email: 'maria@kineto.demo', phone: '+40 731 000 333', status: 'active', monthlyValue: 520, stage: 'won', healthScore: 88, tags: ['post-operator', 'progres'], pinned: true, archived: false, customFields: [{ id: 'diagnostic', label: 'Diagnostic', value: 'Post ligamentoplastie' }, { id: 'progres', label: 'Progres mobilitate', value: 'Flexie 110°' }] },
      { name: 'Radu Enache', company: 'Durere lombară', email: 'radu@kineto.demo', phone: '+40 732 000 444', status: 'lead', monthlyValue: 360, stage: 'new', healthScore: 68, tags: ['evaluare'], pinned: false, archived: false, customFields: [{ id: 'durere', label: 'Nivel durere', value: '7/10' }, { id: 'plan', label: 'Plan ședințe', value: '8 ședințe' }] },
    ],
    tasks: [
      { clientId: null, title: 'Evaluare inițială pacient lombar', description: 'Măsoară durere, mobilitate, contraindicații și stabilește planul.', status: 'todo', priority: 'high', dueDate: '2026-05-03', recurrence: 'none', tags: ['evaluare'], subtasks: [], comments: [], archived: false },
      { clientId: null, title: 'Reevaluare progres genunchi', description: 'Actualizează mobilitatea și exercițiile pentru acasă.', status: 'in_progress', priority: 'medium', dueDate: '2026-05-06', recurrence: 'weekly', tags: ['reevaluare', 'progres'], subtasks: [], comments: [], archived: false },
    ],
  },
  psychology: {
    clients: [
      { name: 'Client A.M.', company: 'Terapie individuală', email: 'client.am@psy.demo', phone: '+40 741 000 555', status: 'active', monthlyValue: 600, stage: 'won', healthScore: 86, tags: ['confidențial', 'săptămânal'], pinned: true, archived: false, customFields: [{ id: 'tip', label: 'Tip ședință', value: 'Individual' }, { id: 'consimtamant', label: 'Consimțământ', value: 'Semnat' }] },
      { name: 'Client R.T.', company: 'Intake nou', email: 'client.rt@psy.demo', phone: '+40 742 000 666', status: 'lead', monthlyValue: 300, stage: 'new', healthScore: 70, tags: ['intake'], pinned: false, archived: false, customFields: [{ id: 'frecventa', label: 'Frecvență', value: 'La 2 săptămâni' }, { id: 'confidentialitate', label: 'Confidențialitate', value: 'De confirmat' }] },
    ],
    tasks: [
      { clientId: null, title: 'Pregătește formular intake și consimțământ', description: 'Trimite documentele înainte de prima ședință.', status: 'todo', priority: 'high', dueDate: '2026-05-02', recurrence: 'none', tags: ['intake', 'consimțământ'], subtasks: [], comments: [], archived: false },
      { clientId: null, title: 'Note follow-up după ședință', description: 'Actualizează obiectivul terapeutic și frecvența recomandată.', status: 'in_progress', priority: 'medium', dueDate: '2026-05-07', recurrence: 'weekly', tags: ['follow-up'], subtasks: [], comments: [], archived: false },
    ],
  },
  custom: {
    clients: [
      { name: 'Client Custom', company: 'Workspace personalizat', email: 'custom@clientflow.demo', phone: '+40 700 000 000', status: 'lead', monthlyValue: 500, stage: 'new', healthScore: 75, tags: ['custom'], pinned: true, archived: false, customFields: [{ id: 'field-1', label: 'Câmp custom 1', value: 'Valoare exemplu' }] },
    ],
    tasks: [
      { clientId: null, title: 'Definește fluxul custom', description: 'Adaptează statusurile, câmpurile și serviciile pentru domeniul ales.', status: 'todo', priority: 'medium', dueDate: '2026-05-05', recurrence: 'none', tags: ['custom'], subtasks: [], comments: [], archived: false },
    ],
  },
}

function uid(prefix: string) {
  return crypto.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function readArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeArray<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getCurrentUserId() {
  try {
    const raw = localStorage.getItem('clientflow-auth')
    const parsed = raw ? JSON.parse(raw) : null
    return parsed?.id ?? parsed?.user?.id ?? 'guest'
  } catch {
    return 'guest'
  }
}

export function buildInviteLink(accessId: string) {
  return `${window.location.origin}${window.location.pathname}#/accept-access/${accessId}`
}

export function applyIndustrySeed(industry: IndustryKey, userId = getCurrentUserId()) {
  const seed = industrySeeds[industry]
  const clients = readArray<Client>(CLIENTS_KEY).filter((item) => item.userId !== userId)
  const tasks = readArray<Task>(TASKS_KEY).filter((item) => item.userId !== userId)
  const now = new Date().toISOString()
  const clientIdMap = new Map<number, string>()

  const nextClients = seed.clients.map((client, index) => {
    const id = uid(`${industry}-client`)
    clientIdMap.set(index, id)
    return { ...client, id, userId, createdAt: now, lastContactedAt: now }
  })

  const nextTasks = seed.tasks.map((task, index) => ({
    ...task,
    id: uid(`${industry}-task`),
    userId,
    clientId: clientIdMap.get(index % Math.max(1, nextClients.length)) ?? null,
    createdAt: now,
  }))

  writeArray(CLIENTS_KEY, [...clients, ...nextClients])
  writeArray(TASKS_KEY, [...tasks, ...nextTasks])
  writeArray(NOTES_KEY, [])
}

export function createWorkspaceProfile(input: {
  name: string
  ownerName: string
  ownerEmail: string
  industry: IndustryKey
  customIndustry?: string
  clientLabel?: string
  serviceLabel?: string
}) {
  const template = industryTemplates[input.industry]
  const profile: WorkspaceProfile = {
    id: uid('workspace'),
    name: input.name,
    ownerName: input.ownerName,
    ownerEmail: input.ownerEmail,
    ...template,
    customIndustry: input.customIndustry,
    clientLabel: input.clientLabel || template.clientLabel,
    serviceLabel: input.serviceLabel || template.serviceLabel,
    createdAt: new Date().toISOString(),
  }

  localStorage.setItem(WORKSPACE_KEY, JSON.stringify(profile))

  const adminAccess: TeamAccess = {
    id: uid('access'),
    name: input.ownerName,
    email: input.ownerEmail,
    role: 'admin',
    permissions: rolePresets.admin.permissions,
    inviteLink: '',
    status: 'active',
    createdAt: new Date().toISOString(),
  }
  adminAccess.inviteLink = buildInviteLink(adminAccess.id)
  localStorage.setItem(TEAM_ACCESS_KEY, JSON.stringify([adminAccess]))
  localStorage.setItem(CURRENT_ACCESS_KEY, JSON.stringify(adminAccess))
  applyIndustrySeed(input.industry)

  return profile
}

export function getWorkspaceProfile(): WorkspaceProfile | null {
  try {
    const raw = localStorage.getItem(WORKSPACE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveWorkspaceProfile(profile: WorkspaceProfile) {
  localStorage.setItem(WORKSPACE_KEY, JSON.stringify(profile))
}

export function getTeamAccess(): TeamAccess[] {
  try {
    const raw = localStorage.getItem(TEAM_ACCESS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveTeamAccess(access: TeamAccess[]) {
  localStorage.setItem(TEAM_ACCESS_KEY, JSON.stringify(access))
}

export function createTeamAccess(input: { name: string; email: string; role: AccessRole; permissions?: PermissionKey[] }) {
  const access: TeamAccess = {
    id: uid('access'),
    name: input.name,
    email: input.email,
    role: input.role,
    permissions: input.permissions ?? rolePresets[input.role].permissions,
    inviteLink: '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  access.inviteLink = buildInviteLink(access.id)
  const all = [access, ...getTeamAccess()]
  saveTeamAccess(all)
  return access
}

export function getCurrentAccess(): TeamAccess | null {
  try {
    const raw = localStorage.getItem(CURRENT_ACCESS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function acceptAccess(accessId: string) {
  const access = getTeamAccess().find((item) => item.id === accessId)
  if (!access) return null
  const activated = { ...access, status: 'active' as const }
  saveTeamAccess(getTeamAccess().map((item) => (item.id === accessId ? activated : item)))
  localStorage.setItem(CURRENT_ACCESS_KEY, JSON.stringify(activated))
  return activated
}

export function can(permission: PermissionKey) {
  const access = getCurrentAccess()
  if (!access) return true
  return access.permissions.includes('fullAccess') || access.permissions.includes(permission)
}
