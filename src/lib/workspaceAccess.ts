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
    statusLabels: ['Programat', 'Confirmat', 'Finalizat', 'VIP follow-up'],
    customFields: ['Preferințe culoare', 'Stilist preferat', 'Alergii', 'Ultima vizită'],
  },
  auto: {
    industry: 'auto',
    clientLabel: 'Client service auto',
    serviceLabel: 'Intervenție auto',
    statusLabels: ['Diagnoză', 'Deviz trimis', 'În lucru', 'Gata de predare'],
    customFields: ['Marca auto', 'Model', 'Număr înmatriculare', 'Kilometraj', 'Serie VIN'],
  },
  kineto: {
    industry: 'kineto',
    clientLabel: 'Pacient kinetoterapie',
    serviceLabel: 'Ședință kineto',
    statusLabels: ['Evaluare', 'Plan tratament', 'În terapie', 'Reevaluare'],
    customFields: ['Diagnostic', 'Obiectiv recuperare', 'Contraindicații', 'Plan ședințe'],
  },
  psychology: {
    industry: 'psychology',
    clientLabel: 'Client psihologie',
    serviceLabel: 'Ședință psihologică',
    statusLabels: ['Intake', 'În terapie', 'Follow-up', 'Închis'],
    customFields: ['Tip ședință', 'Obiectiv terapeutic', 'Consimțământ', 'Frecvență'],
  },
  custom: {
    industry: 'custom',
    clientLabel: 'Client',
    serviceLabel: 'Serviciu',
    statusLabels: ['Nou', 'În lucru', 'În așteptare', 'Finalizat'],
    customFields: ['Câmp custom 1', 'Câmp custom 2'],
  },
}

function uid(prefix: string) {
  return crypto.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function buildInviteLink(accessId: string) {
  return `${window.location.origin}${window.location.pathname}#/accept-access/${accessId}`
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
