import { FormEvent, useMemo, useState } from 'react'
import { addSuiteItem, readSuiteCollection, type TimeEntry } from '../lib/suiteStorage'
import { useLanguage } from '../lib/i18n'
import { can, getWorkspaceProfile } from '../lib/workspaceAccess'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function TimeTrackingPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const workspace = getWorkspaceProfile()
  const clientNoun = workspace?.clientLabel ?? (ro ? 'Client' : 'Client')
  const serviceNoun = workspace?.serviceLabel ?? (ro ? 'Task' : 'Task')
  const canAdd = can('add')
  const [entries, setEntries] = useState<TimeEntry[]>(() => readSuiteCollection('time'))
  const [client, setClient] = useState('')
  const [task, setTask] = useState('')
  const [hours, setHours] = useState('1')
  const [date, setDate] = useState(today())
  const totalHours = useMemo(() => entries.reduce((sum, entry) => sum + entry.hours, 0), [entries])
  const billableEstimate = Math.round(totalHours * 65)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canAdd) return
    addSuiteItem('time', { client, task, hours: Number(hours) || 0, date })
    setEntries(readSuiteCollection('time'))
    setClient('')
    setTask('')
    setHours('1')
    setDate(today())
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">{workspace?.customIndustry ?? workspace?.industry ?? 'Time tracking'}</p>
          <h1 className="page-title">{ro ? 'Ore lucrate și estimare billable' : 'Worked hours and billable estimate'}</h1>
          <p className="muted">{workspace ? `Log local pentru ${clientNoun} și ${serviceNoun}.` : ro ? 'Log local pentru ore pe client și task, pregătit pentru facturare.' : 'Local log for hours by client and task, ready to connect to invoicing.'}</p>
        </div>
      </div>

      {!canAdd ? <section className="card card-pad"><strong>View-only access</strong><p className="small muted" style={{ marginBottom: 0 }}>Logarea timpului este dezactivată pentru rolul curent.</p></section> : null}

      <section className="grid stats">
        <div className="card card-pad stat-card"><div className="small muted">{ro ? 'Intrări' : 'Entries'}</div><div className="stat-value">{entries.length}</div><div className="stat-change">local log</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{ro ? 'Ore totale' : 'Total hours'}</div><div className="stat-value">{totalHours}</div><div className="stat-change">tracked</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{ro ? 'Estimare billable' : 'Billable estimate'}</div><div className="stat-value">€{billableEstimate}</div><div className="stat-change">€65/h demo rate</div></div>
      </section>

      <section className="two-col">
        <div className="card card-pad">
          <h2>{ro ? 'Jurnal timp' : 'Time log'}</h2>
          <div className="list">
            {entries.map((entry) => (
              <div className="note" key={entry.id}>
                <div className="card-title-row">
                  <div><strong>{entry.client}</strong><div className="small muted">{entry.task} · {entry.date}</div></div>
                  <span className="badge active">{entry.hours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="card card-pad">
          <h2>{ro ? 'Adaugă timp' : 'Add time'}</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder={clientNoun} value={client} onChange={(e) => setClient(e.target.value)} required disabled={!canAdd} />
            <input className="input" placeholder={serviceNoun} value={task} onChange={(e) => setTask(e.target.value)} required disabled={!canAdd} />
            <input className="input" type="number" step="0.25" value={hours} onChange={(e) => setHours(e.target.value)} disabled={!canAdd} />
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={!canAdd} />
            <button className="button" disabled={!canAdd}>{ro ? 'Salvează ore' : 'Save hours'}</button>
          </form>
        </aside>
      </section>
    </div>
  )
}
