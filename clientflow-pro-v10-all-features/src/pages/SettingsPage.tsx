import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clientsToCsv, tasksToCsv } from '../lib/csv'
import { exportWorkspaceData, getBackendAdapterInfo, getClients, getSession, getTasks, importWorkspaceJson, resetWorkspaceData, updateProfile } from '../lib/mockApi'
import { useTheme } from '../features/theme/ThemeContext'
import { useLocale } from '../features/locale/LocaleContext'
import { useToast } from '../features/toast/ToastContext'

export function SettingsPage() {
  const queryClient = useQueryClient()
  const session = getSession()
  const { pushToast } = useToast()
  const { locale, setLocale } = useLocale()
  const [fullName, setFullName] = useState(session?.fullName ?? '')
  const [email, setEmail] = useState(session?.email ?? '')
  const [copied, setCopied] = useState(false)
  const { theme, setTheme, toggleTheme } = useTheme()
  const adapter = getBackendAdapterInfo()

  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  const profileMutation = useMutation({ mutationFn: ({ fullName, email }: { fullName: string; email: string }) => updateProfile(fullName, email), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['session'] }); queryClient.invalidateQueries({ queryKey: ['activity'] }); pushToast('Profile saved', 'success') } })
  const resetMutation = useMutation({ mutationFn: resetWorkspaceData, onSuccess: () => { for (const key of ['clients', 'tasks', 'dashboard', 'activity', 'notifications', 'reports', 'calendar']) queryClient.invalidateQueries({ queryKey: [key] }); pushToast('Workspace reset', 'warning') } })
  const importMutation = useMutation({ mutationFn: importWorkspaceJson, onSuccess: () => { for (const key of ['clients', 'tasks', 'dashboard', 'activity', 'notifications', 'reports', 'calendar']) queryClient.invalidateQueries({ queryKey: [key] }); pushToast('Workspace imported', 'success') } })

  const completion = useMemo(() => {
    let score = 35
    if (fullName.trim()) score += 20
    if (email.trim()) score += 15
    if (clients.length > 0) score += 15
    if (tasks.length > 0) score += 15
    return Math.min(score, 100)
  }, [fullName, email, clients.length, tasks.length])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    profileMutation.mutate({ fullName, email })
  }

  async function handleCopyExport() {
    const payload = exportWorkspaceData()
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    setCopied(true)
    pushToast('JSON copied', 'info')
    window.setTimeout(() => setCopied(false), 1800)
  }

  function download(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleDownloadExport() { download('clientflow-workspace-export.json', JSON.stringify(exportWorkspaceData(), null, 2), 'application/json') }
  function handleDownloadClientsCsv() { download('clientflow-clients.csv', clientsToCsv(clients), 'text/csv') }
  function handleDownloadTasksCsv() { download('clientflow-tasks.csv', tasksToCsv(tasks), 'text/csv') }
  async function handleImportJson(file: File) { importMutation.mutate(await file.text()) }

  return (
    <div className="grid page-gap-lg">
      <div className="page-header stack-on-mobile">
        <div>
          <p className="eyebrow">Profile & setup</p>
          <h1 className="page-title">Settings</h1>
          <p className="muted">Profile, theme, language, export/import tools, and a local adapter that stays free.</p>
        </div>
        <div className="page-header-actions mobile-full"><div className="pill">⚙️ Free-first settings</div><div className="pill">📦 {clients.length + tasks.length} records</div></div>
      </div>

      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Portfolio mode</p>
            <h2 className="page-title" style={{ fontSize: '2rem' }}>Make the demo feel like a product.</h2>
            <p className="muted" style={{ maxWidth: 620 }}>This page shows account preferences, portability of data, PWA readiness and a future-proof path toward a real backend without forcing paid services today.</p>
          </div>
          <div className="kpi-strip">
            <div className="kpi-mini"><div className="small muted">Profile completion</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>{completion}%</div></div>
            <div className="kpi-mini"><div className="small muted">Storage</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>Browser</div></div>
            <div className="kpi-mini"><div className="small muted">Cost</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>€0</div></div>
          </div>
        </div>
      </section>

      <div className="two-col two-col-equal mobile-reverse">
        <section className="card card-pad">
          <div className="card-title-row stack-on-mobile"><div><h2 style={{ margin: 0 }}>Profile details</h2><div className="small muted">Update the mock identity shown in the local workspace.</div></div><div className="pill">👤 Local account</div></div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button className="button" disabled={profileMutation.isPending}>{profileMutation.isPending ? 'Saving...' : 'Save profile'}</button>
          </form>
        </section>

        <section className="grid">
          <div className="card card-pad">
            <div className="card-title-row stack-on-mobile"><div><h2 style={{ margin: 0 }}>Appearance & language</h2><div className="small muted">Switch theme and language for demos and screenshots.</div></div><div className="pill">🎨 Theme</div></div>
            <div className="toolbar toolbar-stack-mobile wrap-row" style={{ marginTop: 16, marginBottom: 18 }}>
              <button className={`button ${theme === 'dark' ? '' : 'secondary'}`} onClick={() => setTheme('dark')} type="button">Dark mode</button>
              <button className={`button ${theme === 'light' ? '' : 'secondary'}`} onClick={() => setTheme('light')} type="button">Light mode</button>
              <button className="button secondary" onClick={toggleTheme} type="button">Quick toggle</button>
              <select className="select compact-control" value={locale} onChange={(e) => setLocale(e.target.value as typeof locale)}>
                <option value="en">English</option>
                <option value="ro">Română</option>
              </select>
            </div>
          </div>

          <div className="card card-pad">
            <div className="card-title-row stack-on-mobile"><div><h2 style={{ margin: 0 }}>Workspace tools</h2><div className="small muted">JSON and CSV export, plus JSON import for demos.</div></div><div className="pill">🛠️ Reviewer friendly</div></div>
            <div className="toolbar toolbar-stack-mobile wrap-row">
              <button className="button secondary" onClick={handleCopyExport} type="button">{copied ? 'Copied JSON' : 'Copy JSON export'}</button>
              <button className="button secondary" onClick={handleDownloadExport} type="button">Download JSON</button>
              <button className="button secondary" onClick={handleDownloadClientsCsv} type="button">Export clients CSV</button>
              <button className="button secondary" onClick={handleDownloadTasksCsv} type="button">Export tasks CSV</button>
              <label className="button secondary" style={{ cursor: 'pointer' }}>Import JSON<input type="file" accept=".json" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleImportJson(e.target.files[0])} /></label>
              <button className="button danger" onClick={() => resetMutation.mutate()} type="button" disabled={resetMutation.isPending}>{resetMutation.isPending ? 'Resetting...' : 'Reset demo data'}</button>
            </div>
          </div>

          <div className="card card-pad">
            <div className="card-title-row stack-on-mobile"><div><h2 style={{ margin: 0 }}>Adapter status</h2><div className="small muted">Prepared for Supabase later, local today.</div></div></div>
            <div className="mobile-card-list compact-card-list">
              <article className="mobile-list-card"><div className="mobile-list-row"><strong>Current mode</strong><span className="pill small-pill">{adapter.mode}</span></div></article>
              <article className="mobile-list-card"><div className="mobile-list-row"><strong>Supabase ready</strong><span className="pill small-pill">{adapter.readyForSupabase ? 'Yes' : 'No'}</span></div></article>
              <article className="mobile-list-card"><div className="mobile-list-row"><strong>Monthly cost required</strong><span className="pill small-pill">{adapter.monthlyCostRequired ? 'Yes' : 'No'}</span></div></article>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
