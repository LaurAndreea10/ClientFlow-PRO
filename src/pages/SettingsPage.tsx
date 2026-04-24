import { useEffect, useState } from 'react'

const PREFERENCES_KEY = 'clientflow_preferences'

type Preferences = {
  language: 'EN' | 'RO'
  theme: 'System' | 'Dark' | 'Light'
  density: 'Comfortable' | 'Compact'
  reducedMotion: boolean
  autosave: boolean
  notifications: boolean
}

const defaultPreferences: Preferences = {
  language: 'EN',
  theme: 'System',
  density: 'Comfortable',
  reducedMotion: false,
  autosave: true,
  notifications: true,
}

function readPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY)
    return raw ? { ...defaultPreferences, ...JSON.parse(raw) } : defaultPreferences
  } catch {
    return defaultPreferences
  }
}

export function SettingsPage() {
  const [preferences, setPreferences] = useState<Preferences>(() => readPreferences())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
    setSaved(true)
    const timer = window.setTimeout(() => setSaved(false), 1400)
    return () => window.clearTimeout(timer)
  }, [preferences])

  function updatePreference<Key extends keyof Preferences>(key: Key, value: Preferences[Key]) {
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Workspace setup</p>
          <h1 className="page-title">Settings</h1>
          <p className="muted">Local user preferences, accessibility controls and demo profile details.</p>
        </div>
        <div className="pill">{saved ? 'Autosaved' : 'Local preferences'}</div>
      </div>

      <section className="two-col">
        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>Profile</h2>
              <div className="small muted">Demo account details visible to recruiters.</div>
            </div>
          </div>
          <div className="list">
            <div className="note">
              <div className="small muted">Name</div>
              <strong>Demo User</strong>
            </div>
            <div className="note">
              <div className="small muted">Email</div>
              <strong>demo@clientflow.pro</strong>
            </div>
            <div className="note">
              <div className="small muted">Role</div>
              <strong>Product Manager</strong>
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>Preferences</h2>
              <div className="small muted">Persisted locally in this browser.</div>
            </div>
          </div>
          <div className="form-grid">
            <label className="small muted">Language</label>
            <select className="select" value={preferences.language} onChange={(event) => updatePreference('language', event.target.value as Preferences['language'])}>
              <option value="EN">English</option>
              <option value="RO">Română</option>
            </select>

            <label className="small muted">Theme</label>
            <select className="select" value={preferences.theme} onChange={(event) => updatePreference('theme', event.target.value as Preferences['theme'])}>
              <option value="System">System</option>
              <option value="Dark">Dark</option>
              <option value="Light">Light</option>
            </select>

            <label className="small muted">Density</label>
            <select className="select" value={preferences.density} onChange={(event) => updatePreference('density', event.target.value as Preferences['density'])}>
              <option value="Comfortable">Comfortable</option>
              <option value="Compact">Compact</option>
            </select>
          </div>
        </div>
      </section>

      <section className="card card-pad">
        <div className="card-title-row">
          <div>
            <h2 style={{ margin: 0 }}>Accessibility and workflow</h2>
            <div className="small muted">Settings that show product thinking beyond CRUD.</div>
          </div>
        </div>
        <div className="settings-grid">
          <label className="setting-toggle">
            <span>
              <strong>Reduced motion</strong>
              <span className="small muted">Minimize decorative motion for accessibility.</span>
            </span>
            <input type="checkbox" checked={preferences.reducedMotion} onChange={(event) => updatePreference('reducedMotion', event.target.checked)} />
          </label>
          <label className="setting-toggle">
            <span>
              <strong>Draft autosave</strong>
              <span className="small muted">Keep unfinished forms safe in local storage.</span>
            </span>
            <input type="checkbox" checked={preferences.autosave} onChange={(event) => updatePreference('autosave', event.target.checked)} />
          </label>
          <label className="setting-toggle">
            <span>
              <strong>Notifications</strong>
              <span className="small muted">Show local reminders and workspace alerts.</span>
            </span>
            <input type="checkbox" checked={preferences.notifications} onChange={(event) => updatePreference('notifications', event.target.checked)} />
          </label>
        </div>
      </section>
    </div>
  )
}
