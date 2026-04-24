import { FormEvent, useState } from 'react'
import { generateDemoPlan, readSuiteCollection, writeSuiteCollection, type DemoPlan } from '../lib/suiteStorage'
import { useLanguage } from '../lib/i18n'

const styles = ['SaaS Clean', 'Launch Teaser', 'Investor Deck', 'Tutorial Walkthrough', 'Enterprise Polished', 'Social Reel']

export function DemoPlannerPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const [plans, setPlans] = useState<DemoPlan[]>(() => readSuiteCollection('demos'))
  const [productUrl, setProductUrl] = useState('https://laurandreea10.github.io/ClientFlow-PRO/#/dashboard')
  const [style, setStyle] = useState(styles[0])
  const [duration, setDuration] = useState('45')
  const [objective, setObjective] = useState(ro ? 'Prezintă ClientFlow PRO ca produs portfolio premium' : 'Present ClientFlow PRO as a premium portfolio product')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const plan = generateDemoPlan({ productUrl, style, duration: Number(duration) || 45, objective })
    const next = [plan, ...plans]
    writeSuiteCollection('demos', next)
    setPlans(next)
  }

  function exportPlan(plan: DemoPlan) {
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `clientflow-demo-plan-${plan.id}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">{ro ? 'Demo planner' : 'Demo planner'}</p>
          <h1 className="page-title">{ro ? 'Plan pentru video demo' : 'Product demo video plan'}</h1>
          <p className="muted">{ro ? 'Inspirat de Link Video Editor Studio: URL, stil, durată, readiness score și shot list.' : 'Inspired by Link Video Editor Studio: URL, style, duration, readiness score and shot list.'}</p>
        </div>
      </div>

      <section className="two-col">
        <aside className="card card-pad">
          <h2>{ro ? 'Generează plan' : 'Generate plan'}</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="https://..." />
            <select className="select" value={style} onChange={(e) => setStyle(e.target.value)}>
              {styles.map((item) => <option key={item}>{item}</option>)}
            </select>
            <input className="input" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder={ro ? 'Durată secunde' : 'Duration seconds'} />
            <textarea className="textarea" value={objective} onChange={(e) => setObjective(e.target.value)} rows={4} />
            <button className="button">{ro ? 'Generează' : 'Generate'}</button>
          </form>
        </aside>

        <div className="card card-pad">
          <h2>{ro ? 'Planuri salvate' : 'Saved plans'}</h2>
          <div className="list">
            {plans.map((plan) => (
              <article className="note" key={plan.id}>
                <div className="card-title-row">
                  <div><strong>{plan.style}</strong><div className="small muted">{plan.productUrl}</div></div>
                  <span className="badge active">{plan.readiness}/100</span>
                </div>
                <p className="muted">{plan.objective}</p>
                <ol className="small muted">
                  {plan.shots.map((shot) => <li key={shot}>{shot}</li>)}
                </ol>
                <button className="button secondary" onClick={() => exportPlan(plan)}>{ro ? 'Export JSON' : 'Export JSON'}</button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
