import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { exportWorkspaceData, getClients, getSession, getTasks, resetWorkspaceData, updateProfile } from '../lib/mockApi'
import { useTheme } from '../features/theme/ThemeContext'

export function SettingsPage() {
  const queryClient = useQueryClient()
  const session = getSession()
  const [fullName, setFullName] = useState(session?.fullName ?? '')
  const [email, setEmail] = useState(session?.email ?? '')
  const [copied, setCopied] = useState(false)
  const { theme, setTheme, toggleTheme } = useTheme()

  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  const profileMutation = useMutation({
    mutationFn: ({ fullName, email }: { fullName: string; email: string }) => updateProfile(fullName, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  const resetMutation = useMutation({
    mutationFn: resetWorkspaceData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

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
    window.setTimeout(() => setCopied(false), 1800)
  }

  function handleDownloadExport() {
    const blob = new Blob([JSON.stringify(exportWorkspaceData(), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'clientflow-workspace-export.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid page-gap-lg">
      <div className="page-header stack-on-mobile">
        <div>
          <p className="eyebrow">Profile & setup</p>
          <h1 className="page-title">Settings</h1>
          <p className="muted">Polish the workspace profile, export demo data, and reset everything without any paid service.</p>
        </div>
        <div className="page-header-actions mobile-full">
          <div className="pill">⚙️ Free-first settings</div>
          <div className="pill">📦 {clients.length + tasks.length} records</div>
        </div>
      </div>

      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Portfolio mode</p>
            <h2 className="page-title" style={{ fontSize: '2rem' }}>Make the demo feel like a product.</h2>
            <p className="muted" style={{ maxWidth: 620 }}>
              This page helps you show account-level thinking: profile settings, portability of data, and an easy reset flow for reviewers.
            </p>
          </div>
          <div className="kpi-strip">
            <div className="kpi-mini">
              <div className="small muted">Profile completion</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>{completion}%</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Storage</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>Browser</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Cost</div>
              <div className="stat-value" style={{ fontSize: '1.6rem' }}>€0</div>
            </div>
          </div>
        </div>
      </section>

      <div className="two-col two-col-equal mobile-reverse">
        <section className="card card-pad">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>Profile details</h2>
              <div className="small muted">Update the mock identity shown in the local workspace.</div>
            </div>
            <div className="pill">👤 Local account</div>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button className="button" disabled={profileMutation.isPending}>
              {profileMutation.isPending ? 'Saving...' : 'Save profile'}
            </button>
          </form>

          <div className="list" style={{ marginTop: 16 }}>
            <div className="note">
              <strong>Why this matters in a portfolio</strong>
              <div className="small muted" style={{ marginTop: 6 }}>
                Recruiters often notice product thinking when a project includes account preferences, data handling and reset flows.
              </div>
            </div>
          </div>
        </section>

        <section className="grid">
          <div className="card card-pad">
            <div className="card-title-row stack-on-mobile">
              <div>
                <h2 style={{ margin: 0 }}>Appearance</h2>
                <div className="small muted">Switch between dark and light mode for demos and screenshots.</div>
              </div>
              <div className="pill">🎨 Theme</div>
            </div>

            <div className="toolbar toolbar-stack-mobile wrap-row" style={{ marginTop: 16, marginBottom: 18 }}>
              <button className={`button ${theme === 'dark' ? '' : 'secondary'}`} onClick={() => setTheme('dark')} type="button">Dark mode</button>
              <button className={`button ${theme === 'light' ? '' : 'secondary'}`} onClick={() => setTheme('light')} type="button">Light mode</button>
              <button className="button secondary" onClick={toggleTheme} type="button">Quick toggle</button>
            </div>
          </div>

          <div className="card card-pad">
            <div className="card-title-row stack-on-mobile">
              <div>
                <h2 style={{ margin: 0 }}>Workspace tools</h2>
                <div className="small muted">Export demo data or clear the workspace instantly.</div>
              </div>
              <div className="pill">🛠️ Reviewer friendly</div>
            </div>

            <div className="toolbar toolbar-stack-mobile wrap-row">
              <button className="button secondary" onClick={handleCopyExport} type="button">
                {copied ? 'Copied JSON' : 'Copy JSON export'}
              </button>
              <button className="button secondary" onClick={handleDownloadExport} type="button">Download export</button>
              <button className="button danger" onClick={() => resetMutation.mutate()} type="button" disabled={resetMutation.isPending}>
                {resetMutation.isPending ? 'Resetting...' : 'Reset demo data'}
              </button>
            </div>
          </div>

          <div className="card card-pad">
            <div className="card-title-row stack-on-mobile">
              <div>
                <h2 style={{ margin: 0 }}>Workspace summary</h2>
                <div className="small muted">Useful for README bullets and quick project talking points.</div>
              </div>
            </div>
            <div className="mobile-card-list compact-card-list">
              <article className="mobile-list-card">
                <div className="mobile-list-row"><strong>Clients saved</strong><span className="pill small-pill">{clients.length}</span></div>
              </article>
              <article className="mobile-list-card">
                <div className="mobile-list-row"><strong>Tasks saved</strong><span className="pill small-pill">{tasks.length}</span></div>
              </article>
              <article className="mobile-list-card">
                <div className="mobile-list-row"><strong>Hosting required</strong><span className="pill small-pill">No</span></div>
              </article>
              <article className="mobile-list-card">
                <div className="mobile-list-row"><strong>Paid backend required</strong><span className="pill small-pill">No</span></div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
