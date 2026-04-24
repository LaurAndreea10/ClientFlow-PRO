import { ChangeEvent, useEffect, useState } from 'react'
import { downloadWorkspaceBackup, restoreWorkspaceBackup } from '../lib/backup'
import { notifyPreferencesChanged, PREFERENCES_KEY, useLanguage } from '../lib/i18n'

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
  const { language, copy } = useLanguage()
  const t = copy.settings
  const [preferences, setPreferences] = useState<Preferences>(() => readPreferences())
  const [saved, setSaved] = useState(false)
  const [restoreMessage, setRestoreMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
    notifyPreferencesChanged()
    setSaved(true)
    const timer = window.setTimeout(() => setSaved(false), 1400)
    return () => window.clearTimeout(timer)
  }, [preferences])

  function updatePreference<Key extends keyof Preferences>(key: Key, value: Preferences[Key]) {
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  async function handleRestore(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const backup = await restoreWorkspaceBackup(file)
      notifyPreferencesChanged()
      setPreferences(readPreferences())
      setRestoreMessage(language === 'RO' ? `Backup restaurat: ${backup.exportedAt}` : `Backup restored: ${backup.exportedAt}`)
    } catch (error) {
      setRestoreMessage(error instanceof Error ? error.message : language === 'RO' ? 'Backup invalid' : 'Invalid backup')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="page-title">{t.title}</h1>
          <p className="muted">{t.description}</p>
        </div>
        <div className="pill">{saved ? t.autosaved : t.localPreferences}</div>
      </div>

      <section className="two-col">
        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>{t.profile}</h2>
              <div className="small muted">{t.profileHint}</div>
            </div>
          </div>
          <div className="list">
            <div className="note">
              <div className="small muted">{t.name}</div>
              <strong>Demo User</strong>
            </div>
            <div className="note">
              <div className="small muted">{t.email}</div>
              <strong>demo@clientflow.pro</strong>
            </div>
            <div className="note">
              <div className="small muted">{t.role}</div>
              <strong>Product Manager</strong>
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <h2 style={{ margin: 0 }}>{t.preferences}</h2>
              <div className="small muted">{t.preferencesHint}</div>
            </div>
          </div>
          <div className="form-grid">
            <label className="small muted">{t.language}</label>
            <select className="select" value={preferences.language} onChange={(event) => updatePreference('language', event.target.value as Preferences['language'])}>
              <option value="EN">English</option>
              <option value="RO">Română</option>
            </select>

            <label className="small muted">{t.theme}</label>
            <select className="select" value={preferences.theme} onChange={(event) => updatePreference('theme', event.target.value as Preferences['theme'])}>
              <option value="System">{t.system}</option>
              <option value="Dark">{t.dark}</option>
              <option value="Light">{t.light}</option>
            </select>

            <label className="small muted">{t.density}</label>
            <select className="select" value={preferences.density} onChange={(event) => updatePreference('density', event.target.value as Preferences['density'])}>
              <option value="Comfortable">{t.comfortable}</option>
              <option value="Compact">{t.compact}</option>
            </select>
          </div>
        </div>
      </section>

      <section className="card card-pad">
        <div className="card-title-row">
          <div>
            <h2 style={{ margin: 0 }}>{language === 'RO' ? 'Backup și restore' : 'Backup and restore'}</h2>
            <div className="small muted">
              {language === 'RO'
                ? 'Exportă sau restaurează workspace-ul local: sesiune, preferințe, clienți, task-uri, notițe și view-uri salvate.'
                : 'Export or restore the local workspace: session, preferences, clients, tasks, notes and saved views.'}
            </div>
          </div>
          <div className="pill">JSON</div>
        </div>
        <div className="toolbar">
          <button className="button" type="button" onClick={downloadWorkspaceBackup}>
            {language === 'RO' ? 'Descarcă backup JSON' : 'Download JSON backup'}
          </button>
          <label className="button secondary" style={{ cursor: 'pointer' }}>
            {language === 'RO' ? 'Restaurează backup' : 'Restore backup'}
            <input type="file" accept="application/json" onChange={handleRestore} style={{ display: 'none' }} />
          </label>
        </div>
        {restoreMessage ? <div className="small muted" style={{ marginTop: 12 }}>{restoreMessage}</div> : null}
      </section>

      <section className="card card-pad">
        <div className="card-title-row">
          <div>
            <h2 style={{ margin: 0 }}>{t.accessibility}</h2>
            <div className="small muted">{t.accessibilityHint}</div>
          </div>
        </div>
        <div className="settings-grid">
          <label className="setting-toggle">
            <span>
              <strong>{t.reducedMotion}</strong>
              <span className="small muted">{t.reducedMotionHint}</span>
            </span>
            <input type="checkbox" checked={preferences.reducedMotion} onChange={(event) => updatePreference('reducedMotion', event.target.checked)} />
          </label>
          <label className="setting-toggle">
            <span>
              <strong>{t.draftAutosave}</strong>
              <span className="small muted">{t.draftAutosaveHint}</span>
            </span>
            <input type="checkbox" checked={preferences.autosave} onChange={(event) => updatePreference('autosave', event.target.checked)} />
          </label>
          <label className="setting-toggle">
            <span>
              <strong>{t.notifications}</strong>
              <span className="small muted">{t.notificationsHint}</span>
            </span>
            <input type="checkbox" checked={preferences.notifications} onChange={(event) => updatePreference('notifications', event.target.checked)} />
          </label>
        </div>
      </section>
    </div>
  )
}
