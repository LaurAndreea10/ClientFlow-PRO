const BACKUP_KEYS = [
  'clientflow_session',
  'clientflow_preferences',
  'clientflow_clients',
  'clientflow_tasks',
  'clientflow_notes',
  'clientflow_task_saved_view',
  'clientflow_tour_seen',
  'clientflow_workspace_profile',
  'clientflow_team_access',
  'clientflow_current_access',
  'clientflow_suite_invoices',
  'clientflow_suite_services',
  'clientflow_suite_time_entries',
  'clientflow_suite_portals',
  'clientflow_suite_demo_plans',
  'clientflow_suite_impact_goals',
  'clientflow_suite_beauty_bookings',
  'clientflow_suite_automation_rules',
  'clientflow_suite_notifications',
] as const

export type WorkspaceBackup = {
  app: 'ClientFlow PRO'
  version: 1
  exportedAt: string
  keys: Record<string, unknown>
}

export function createWorkspaceBackup(): WorkspaceBackup {
  const keys = BACKUP_KEYS.reduce<Record<string, unknown>>((acc, key) => {
    const raw = localStorage.getItem(key)
    if (!raw) return acc

    try {
      acc[key] = JSON.parse(raw)
    } catch {
      acc[key] = raw
    }

    return acc
  }, {})

  return {
    app: 'ClientFlow PRO',
    version: 1,
    exportedAt: new Date().toISOString(),
    keys,
  }
}

export function downloadWorkspaceBackup() {
  const backup = createWorkspaceBackup()
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `clientflow-pro-backup-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function restoreWorkspaceBackup(file: File) {
  return new Promise<WorkspaceBackup>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as WorkspaceBackup
        if (parsed.app !== 'ClientFlow PRO' || !parsed.keys || typeof parsed.keys !== 'object') {
          throw new Error('Invalid ClientFlow PRO backup file')
        }

        Object.entries(parsed.keys).forEach(([key, value]) => {
          if (!BACKUP_KEYS.includes(key as (typeof BACKUP_KEYS)[number])) return
          localStorage.setItem(key, JSON.stringify(value))
        })

        resolve(parsed)
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Could not restore backup'))
      }
    }

    reader.onerror = () => reject(new Error('Could not read backup file'))
    reader.readAsText(file)
  })
}
