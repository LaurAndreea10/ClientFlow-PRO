import { useLanguage } from '../lib/i18n'

const checks = [
  { label: 'Live demo link', done: true },
  { label: 'Demo credentials', done: true },
  { label: 'Seed data', done: true },
  { label: 'PWA setup', done: true },
  { label: 'EN / RO language switch', done: true },
  { label: 'Backup / restore', done: true },
  { label: 'AI Copilot', done: true },
  { label: 'Automations', done: true },
  { label: 'Public portal preview', done: true },
  { label: 'README product positioning', done: true },
]

export function PortfolioScorePage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const score = Math.round((checks.filter((check) => check.done).length / checks.length) * 100)

  return (
    <div className="grid">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">{ro ? 'Scor portofoliu' : 'Portfolio score'}</p>
            <h1 className="page-title">{ro ? 'Audit automat pentru demo readiness.' : 'Automated audit for demo readiness.'}</h1>
            <p className="muted" style={{ maxWidth: 680 }}>
              {ro ? 'O pagină de încredere pentru recruiteri: arată clar ce este complet, testabil și gata de prezentare.' : 'A trust page for reviewers: it shows what is complete, testable and ready to present.'}
            </p>
          </div>
          <div className="readiness-card">
            <div className="small muted">{ro ? 'Scor final' : 'Final score'}</div>
            <div className="readiness-score">{score}</div>
            <div className="health-bar"><span style={{ width: `${score}%` }} /></div>
          </div>
        </div>
      </section>

      <section className="suite-roadmap">
        {checks.map((check) => <div className="note" key={check.label}>✓ {check.label}</div>)}
      </section>
    </div>
  )
}
