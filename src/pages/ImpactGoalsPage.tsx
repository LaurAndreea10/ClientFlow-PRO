import { FormEvent, useMemo, useState } from 'react'
import { addSuiteItem, readSuiteCollection, type ImpactGoal } from '../lib/suiteStorage'
import { useLanguage } from '../lib/i18n'
import { can, getWorkspaceProfile } from '../lib/workspaceAccess'

export function ImpactGoalsPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const workspace = getWorkspaceProfile()
  const canAdd = can('add')
  const [goals, setGoals] = useState<ImpactGoal[]>(() => readSuiteCollection('impact'))
  const [title, setTitle] = useState('')
  const [metric, setMetric] = useState('')
  const [current, setCurrent] = useState('0')
  const [target, setTarget] = useState('100')
  const [dueDate, setDueDate] = useState('2026-05-30')
  const averageProgress = useMemo(() => Math.round(goals.reduce((sum, goal) => sum + Math.min(100, goal.target ? (goal.current / goal.target) * 100 : 0), 0) / Math.max(1, goals.length)), [goals])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canAdd) return
    addSuiteItem('impact', { title, metric, current: Number(current) || 0, target: Number(target) || 1, dueDate })
    setGoals(readSuiteCollection('impact'))
    setTitle('')
    setMetric('')
    setCurrent('0')
    setTarget('100')
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">{workspace?.customIndustry ?? workspace?.industry ?? 'ImpactPath'}</p>
          <h1 className="page-title">{ro ? 'Obiective, progres și impact' : 'Goals, progress and impact'}</h1>
          <p className="muted">{workspace ? `Obiective pentru ${workspace.name}: ${workspace.clientLabel}, ${workspace.serviceLabel}.` : ro ? 'Inspirat de ALPIS ImpactPath: misiune, progres și direcție vizibilă.' : 'Inspired by ALPIS ImpactPath: mission, progress and visible direction.'}</p>
        </div>
        <div className="pill">{averageProgress}% progress</div>
      </div>

      {!canAdd ? <section className="card card-pad"><strong>View-only access</strong><p className="small muted" style={{ marginBottom: 0 }}>Crearea de obiective este dezactivată pentru rolul curent.</p></section> : null}

      <section className="two-col">
        <div className="card card-pad">
          <h2>{ro ? 'Obiective active' : 'Active goals'}</h2>
          <div className="list">
            {goals.map((goal) => {
              const progress = Math.min(100, Math.round((goal.current / Math.max(1, goal.target)) * 100))
              return (
                <article className="note" key={goal.id}>
                  <div className="card-title-row">
                    <div><strong>{goal.title}</strong><div className="small muted">{goal.metric} · due {goal.dueDate}</div></div>
                    <span className="badge active">{progress}%</span>
                  </div>
                  <div className="health-bar"><span style={{ width: `${progress}%` }} /></div>
                  <div className="small muted" style={{ marginTop: 8 }}>{goal.current} / {goal.target}</div>
                </article>
              )
            })}
          </div>
        </div>
        <aside className="card card-pad">
          <h2>{ro ? 'Obiectiv nou' : 'New goal'}</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder={ro ? 'Titlu' : 'Title'} value={title} onChange={(e) => setTitle(e.target.value)} required disabled={!canAdd} />
            <input className="input" placeholder={ro ? 'Metrică' : 'Metric'} value={metric} onChange={(e) => setMetric(e.target.value)} required disabled={!canAdd} />
            <input className="input" type="number" placeholder={ro ? 'Curent' : 'Current'} value={current} onChange={(e) => setCurrent(e.target.value)} disabled={!canAdd} />
            <input className="input" type="number" placeholder={ro ? 'Țintă' : 'Target'} value={target} onChange={(e) => setTarget(e.target.value)} disabled={!canAdd} />
            <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={!canAdd} />
            <button className="button" disabled={!canAdd}>{ro ? 'Salvează obiectiv' : 'Save goal'}</button>
          </form>
        </aside>
      </section>
    </div>
  )
}
