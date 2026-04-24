import { useLanguage } from '../lib/i18n'

const modules = [
  'CRM Pipeline',
  'Kanban Tasks',
  'Reports',
  'Calendar',
  'Activity Log',
  'AI Copilot',
  'Backup / Restore',
  'Bilingual EN / RO',
]

export function CaseStudyPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'

  return (
    <div className="grid">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">{ro ? 'Studiu de caz' : 'Case study'}</p>
            <h1 className="page-title">
              {ro ? 'ClientFlow PRO — CRM local-first pentru portofoliu premium.' : 'ClientFlow PRO — a local-first CRM built as a premium portfolio product.'}
            </h1>
            <p className="muted" style={{ maxWidth: 720 }}>
              {ro
                ? 'Proiectul transformă un dashboard CRM într-un produs demonstrabil: demo instant, date realiste, UI bilingv, AI Copilot, reset demo și backup complet fără backend plătit.'
                : 'The project turns a CRM dashboard into a demonstrable product: instant demo, realistic data, bilingual UI, AI Copilot, demo reset and full backup without a paid backend.'}
            </p>
          </div>
          <div className="kpi-strip">
            <div className="kpi-mini"><div className="small muted">Modules</div><div className="stat-value" style={{ fontSize: '1.7rem' }}>8+</div></div>
            <div className="kpi-mini"><div className="small muted">Backend cost</div><div className="stat-value" style={{ fontSize: '1.7rem' }}>€0</div></div>
            <div className="kpi-mini"><div className="small muted">Languages</div><div className="stat-value" style={{ fontSize: '1.7rem' }}>EN/RO</div></div>
          </div>
        </div>
      </section>

      <section className="two-col">
        <div className="card card-pad">
          <p className="eyebrow">{ro ? 'Problema' : 'Problem'}</p>
          <h2>{ro ? 'Freelancerii și echipele mici pierd context între tool-uri.' : 'Freelancers and small teams lose context across tools.'}</h2>
          <p className="muted">
            {ro
              ? 'Clienții, task-urile, notițele, rapoartele și follow-up-ul ajung în aplicații separate. Pentru un demo de portofoliu, provocarea este să arăți gândire de produs, nu doar CRUD.'
              : 'Clients, tasks, notes, reports and follow-up often live in separate apps. For a portfolio demo, the challenge is to show product thinking, not just CRUD screens.'}
          </p>
        </div>
        <div className="card card-pad">
          <p className="eyebrow">{ro ? 'Soluția' : 'Solution'}</p>
          <h2>{ro ? 'Un workspace CRM complet, local-first și ușor de încercat.' : 'A complete, local-first CRM workspace that is easy to try.'}</h2>
          <p className="muted">
            {ro
              ? 'Recruiterul poate intra cu Try Demo, poate schimba limba, poate edita datele, poate reseta demo-ul și poate exporta/restaura workspace-ul.'
              : 'A reviewer can enter with Try Demo, switch languages, edit data, reset the demo and export/restore the workspace.'}
          </p>
        </div>
      </section>

      <section className="card card-pad">
        <div className="card-title-row">
          <div>
            <p className="eyebrow">{ro ? 'Module' : 'Modules'}</p>
            <h2 style={{ margin: 0 }}>{ro ? 'Ce demonstrează aplicația' : 'What the app demonstrates'}</h2>
          </div>
          <div className="pill">Portfolio-ready</div>
        </div>
        <div className="stack">
          {modules.map((item) => <span className="stack-chip" key={item}>{item}</span>)}
        </div>
      </section>

      <section className="grid stats">
        <div className="card card-pad stat-card"><div className="small muted">React Query</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>Cache</div><div className="stat-change">Invalidation + local API</div></div>
        <div className="card card-pad stat-card"><div className="small muted">HashRouter</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>Pages</div><div className="stat-change">GitHub Pages-safe routes</div></div>
        <div className="card card-pad stat-card"><div className="small muted">i18n</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>EN/RO</div><div className="stat-change">Instant local preference</div></div>
        <div className="card card-pad stat-card"><div className="small muted">PWA</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>Ready</div><div className="stat-change">Manifest + service worker</div></div>
      </section>

      <section className="card card-pad">
        <p className="eyebrow">{ro ? 'Direcție' : 'Vision'}</p>
        <h2>{ro ? 'Mai mult decât Alpis-style polish: structură modulară și extensibilă.' : 'More than Alpis-style polish: modular and extensible structure.'}</h2>
        <p className="muted">
          {ro
            ? 'ClientFlow PRO este deja împărțit pe pagini, componente, lib, auth, data și routes. Direcția naturală este integrare Supabase, colaborare multi-user, raportare PDF și automatizări reale.'
            : 'ClientFlow PRO is already split into pages, components, lib, auth, data and routes. The natural next step is Supabase integration, multi-user collaboration, PDF reporting and real automations.'}
        </p>
      </section>
    </div>
  )
}
