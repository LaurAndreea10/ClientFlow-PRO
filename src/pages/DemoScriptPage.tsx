import { Link } from 'react-router-dom'
import { useLanguage } from '../lib/i18n'

const routePlan = [
  { time: '00:00', route: '/landing', title: 'Open landing', talkingPoint: 'ClientFlow PRO is a configurable CRM and operations suite for multiple industries.' },
  { time: '00:10', route: '/start-here', title: 'Start Here', talkingPoint: 'The app includes a guided demo path so reviewers know exactly where to look.' },
  { time: '00:20', route: '/command-center', title: 'Command Center', talkingPoint: 'This is the executive overview: priorities, open revenue, bookings, risks and notifications.' },
  { time: '00:30', route: '/workspace-setup', title: 'Workspace Access', talkingPoint: 'Admins choose the industry, customize CRM terminology and create role-based access links.' },
  { time: '00:42', route: '/clients', title: 'Industry CRM', talkingPoint: 'CRM labels and status pipelines adapt to Beauty, Auto, Kineto, Psychology or Custom workspaces.' },
  { time: '00:52', route: '/automations', title: 'Automations', talkingPoint: 'Local automation rules generate notifications from tasks, invoices, bookings and high-value leads.' },
  { time: '01:00', route: '/portfolio-score', title: 'Close with score', talkingPoint: 'The Portfolio Score page summarizes demo readiness and product completeness.' },
]

const faq = [
  {
    q: 'Where is the backend?',
    a: 'This portfolio version is intentionally local-first to keep hosting free and demo friction low. The architecture is Supabase-ready and documented in docs/SUPABASE_READY.md with tables, RLS policy sketch and migration path.',
  },
  {
    q: 'Are permissions real?',
    a: 'Yes at UI/workflow level. Buttons and status actions are disabled based on Admin, Angajat and Angajat nou roles. Production security would move enforcement to Supabase RLS.',
  },
  {
    q: 'What makes this more than a dashboard?',
    a: 'It has onboarding, industry templates, seed data, role-based access, automations, notifications, portal preview, backup/restore and a guided demo flow.',
  },
]

export function DemoScriptPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'

  return (
    <div className="grid">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">{ro ? 'Demo Script' : 'Demo Script'}</p>
            <h1 className="page-title">{ro ? 'Pitch de 60 secunde pentru ClientFlow PRO.' : '60-second pitch for ClientFlow PRO.'}</h1>
            <p className="muted" style={{ maxWidth: 720 }}>
              {ro
                ? 'Folosește acest script când prezinți proiectul: arată intrarea publică, fluxul demo, configurarea pe domeniu, permisiunile, automatizările și scorul final.'
                : 'Use this when presenting the project: show the public entry, demo flow, industry setup, permissions, automations and final readiness score.'}
            </p>
          </div>
          <div className="readiness-card">
            <div className="small muted">{ro ? 'Durată' : 'Length'}</div>
            <div className="readiness-score">60s</div>
            <div className="small muted">{ro ? 'pitch recomandat' : 'recommended pitch'}</div>
          </div>
        </div>
      </section>

      <section className="card card-pad">
        <p className="eyebrow">{ro ? 'Ce spui' : 'What to say'}</p>
        <h2>{ro ? 'Script scurt' : 'Short script'}</h2>
        <p className="muted">
          {ro
            ? 'ClientFlow PRO este o suită CRM și operațională configurabilă pe domeniu. Adminul creează workspace-ul, alege industria, personalizează etichetele și statusurile, apoi invită angajați cu roluri diferite. Aplicația include CRM, task-uri, facturi, booking, automations, notificări, portal preview, backup și o arhitectură pregătită pentru Supabase. Versiunea demo este local-first ca să fie gratuită, rapidă și ușor de testat.'
            : 'ClientFlow PRO is an industry-configurable CRM and operations suite. The admin creates the workspace, chooses the industry, customizes labels and statuses, then invites employees with different roles. The app includes CRM, tasks, invoices, booking, automations, notifications, portal preview, backup and a Supabase-ready architecture. The demo version is local-first so it stays free, fast and easy to test.'}
        </p>
      </section>

      <section className="card card-pad">
        <div className="card-title-row"><h2 style={{ margin: 0 }}>{ro ? 'Rute de deschis' : 'Routes to open'}</h2><span className="pill">60 seconds</span></div>
        <div className="list">
          {routePlan.map((item) => (
            <Link className="note" to={item.route} key={item.time}>
              <div className="card-title-row">
                <div>
                  <strong>{item.time} · {item.title}</strong>
                  <div className="small muted">{item.talkingPoint}</div>
                </div>
                <span className="badge active">{item.route}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="suite-grid">
        {['Industry setup', 'Role-based access', 'Domain seed data', 'Automation engine', 'Supabase-ready docs'].map((item) => (
          <article className="card card-pad suite-card" key={item}>
            <div className="suite-icon">✓</div>
            <h2>{item}</h2>
            <p className="muted">{ro ? 'Feature important de evidențiat în demo.' : 'Important feature to highlight during the demo.'}</p>
          </article>
        ))}
      </section>

      <section className="card card-pad">
        <h2>{ro ? 'Întrebări posibile' : 'Likely questions'}</h2>
        <div className="list">
          {faq.map((item) => (
            <div className="note" key={item.q}>
              <strong>{item.q}</strong>
              <div className="small muted">{item.a}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
