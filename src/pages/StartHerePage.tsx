import { Link } from 'react-router-dom'
import { useLanguage } from '../lib/i18n'

const demoSteps = [
  { href: '/login', title: { EN: 'Try Demo', RO: 'Încearcă demo' }, detail: { EN: 'Start from the public login screen and enter with one click.', RO: 'Pornește din login și intră în demo cu un click.' } },
  { href: '/command-center', title: { EN: 'Command Center', RO: 'Command Center' }, detail: { EN: 'Review priorities, revenue, bookings and next actions.', RO: 'Vezi priorități, venituri, bookings și acțiuni următoare.' } },
  { href: '/workspace-setup', title: { EN: 'Workspace Access', RO: 'Accese workspace' }, detail: { EN: 'See domain-specific CRM setup, roles and invite links.', RO: 'Vezi configurarea CRM, rolurile și linkurile de acces.' } },
  { href: '/beauty', title: { EN: 'Beauty Studio', RO: 'Beauty Studio' }, detail: { EN: 'Open the booking workflow and retention layer.', RO: 'Deschide booking-ul și layer-ul de retenție.' } },
  { href: '/automations', title: { EN: 'Automations', RO: 'Automatizări' }, detail: { EN: 'Run local rules that generate notifications.', RO: 'Rulează reguli locale care generează notificări.' } },
  { href: '/portfolio-score', title: { EN: 'Portfolio Score', RO: 'Scor portofoliu' }, detail: { EN: 'Close with the readiness checklist.', RO: 'Închide demo-ul cu checklist-ul de readiness.' } },
]

export function StartHerePage() {
  const { language } = useLanguage()
  const ro = language === 'RO'

  return (
    <div className="grid">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">{ro ? 'Start demo' : 'Start here'}</p>
            <h1 className="page-title">{ro ? 'Flux recomandat pentru recruiter.' : 'Recommended recruiter demo flow.'}</h1>
            <p className="muted" style={{ maxWidth: 720 }}>
              {ro
                ? 'O rută ghidată care arată rapid valoarea produsului: demo, command center, accese, domeniu, automations și scor final.'
                : 'A guided route that quickly shows product value: demo, command center, access roles, industry setup, automations and final score.'}
            </p>
          </div>
          <div className="readiness-card">
            <div className="small muted">{ro ? 'Durată demo' : 'Demo length'}</div>
            <div className="readiness-score">6</div>
            <div className="small muted">{ro ? 'pași recomandați' : 'recommended steps'}</div>
          </div>
        </div>
      </section>

      <section className="suite-grid">
        {demoSteps.map((step, index) => (
          <Link className="card card-pad suite-card" key={step.href} to={step.href}>
            <div className="suite-icon">{String(index + 1).padStart(2, '0')}</div>
            <h2>{step.title[language]}</h2>
            <p className="muted">{step.detail[language]}</p>
            <span className="badge active">{ro ? 'Deschide' : 'Open'}</span>
          </Link>
        ))}
      </section>

      <section className="card card-pad">
        <p className="eyebrow">{ro ? 'Pitch rapid' : 'Quick pitch'}</p>
        <h2>{ro ? 'ClientFlow PRO este configurabil pe domeniu și pregătit pentru echipe.' : 'ClientFlow PRO is industry-configurable and team-ready.'}</h2>
        <p className="muted">
          {ro
            ? 'Adminul creează workspace-ul, alege domeniul, definește câmpuri și statusuri, creează accese și trimite linkul. Angajații văd doar ce permite rolul lor.'
            : 'The admin creates the workspace, chooses the industry, defines fields and statuses, creates access profiles and sends the link. Employees see only what their role permits.'}
        </p>
      </section>
    </div>
  )
}
