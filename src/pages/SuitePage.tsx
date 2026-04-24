import { useLanguage } from '../lib/i18n'

const suiteModules = [
  {
    source: 'Alpis Fusion CRM Premium',
    icon: '🤖',
    title: { EN: 'AI Operations Copilot', RO: 'AI Copilot operațional' },
    detail: {
      EN: 'Local recommendations for overdue work, high-value leads, churn risk and revenue forecast.',
      RO: 'Recomandări locale pentru task-uri întârziate, lead-uri valoroase, risc de churn și forecast de venit.',
    },
    status: 'live',
  },
  {
    source: 'ClientFlow SaaS',
    icon: '🧾',
    title: { EN: 'Invoices, templates and client portal', RO: 'Facturi, template-uri și portal client' },
    detail: {
      EN: 'Product direction for billing, service templates, time tracking and client-facing delivery views.',
      RO: 'Direcție de produs pentru facturare, template-uri servicii, time tracking și view-uri pentru client.',
    },
    status: 'planned',
  },
  {
    source: 'ALPIS ImpactPath',
    icon: '🧭',
    title: { EN: 'Impact roadmap', RO: 'Roadmap de impact' },
    detail: {
      EN: 'Mission, progress and impact structure that explains why the product exists and where it goes next.',
      RO: 'Structură de misiune, progres și impact care explică de ce există produsul și unde merge mai departe.',
    },
    status: 'live',
  },
  {
    source: 'Link Video Editor Studio',
    icon: '🎬',
    title: { EN: 'Demo Studio readiness', RO: 'Demo Studio readiness' },
    detail: {
      EN: 'Shot-list thinking, demo planning, readiness score and export mindset for portfolio presentation.',
      RO: 'Gândire de shot-list, plan demo, readiness score și exporturi pentru prezentare de portofoliu.',
    },
    status: 'new',
  },
]

const automationFlows = [
  { step: '01', EN: 'Lead captured', RO: 'Lead capturat' },
  { step: '02', EN: 'Proposal generated', RO: 'Ofertă generată' },
  { step: '03', EN: 'Tasks created', RO: 'Task-uri create' },
  { step: '04', EN: 'Invoice prepared', RO: 'Factură pregătită' },
  { step: '05', EN: 'Follow-up scheduled', RO: 'Follow-up programat' },
]

const demoStyles = [
  'SaaS Clean',
  'Launch Teaser',
  'Investor Deck',
  'Tutorial Walkthrough',
  'Enterprise Polished',
  'Social Reel',
]

export function SuitePage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const readiness = 94

  return (
    <div className="grid">
      <section className="hero suite-hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">{ro ? 'Best-of product suite' : 'Best-of product suite'}</p>
            <h1 className="page-title">
              {ro
                ? 'ClientFlow PRO devine hub-ul complet pentru CRM, operațiuni, impact și demo-uri.'
                : 'ClientFlow PRO becomes the complete hub for CRM, operations, impact and demos.'}
            </h1>
            <p className="muted" style={{ maxWidth: 720 }}>
              {ro
                ? 'Această pagină unește cele mai bune idei din Alpis Fusion, ClientFlow SaaS, ImpactPath și Link Video Editor Studio într-o direcție coerentă de produs.'
                : 'This page combines the strongest ideas from Alpis Fusion, ClientFlow SaaS, ImpactPath and Link Video Editor Studio into one coherent product direction.'}
            </p>
          </div>
          <div className="readiness-card">
            <div className="small muted">{ro ? 'Scor readiness produs' : 'Product readiness score'}</div>
            <div className="readiness-score">{readiness}</div>
            <div className="health-bar"><span style={{ width: `${readiness}%` }} /></div>
            <p className="small muted">
              {ro
                ? 'Demo instant, rute GitHub Pages, date seed, EN/RO, AI Copilot, backup și PWA.'
                : 'Instant demo, GitHub Pages routes, seed data, EN/RO, AI Copilot, backup and PWA.'}
            </p>
          </div>
        </div>
      </section>

      <section className="suite-grid">
        {suiteModules.map((module) => (
          <article className="card card-pad suite-card" key={module.source}>
            <div className="suite-icon">{module.icon}</div>
            <div className="small muted">{module.source}</div>
            <h2>{module.title[language]}</h2>
            <p className="muted">{module.detail[language]}</p>
            <span className={`badge ${module.status === 'live' ? 'active' : module.status === 'new' ? 'high' : 'medium'}`}>
              {module.status === 'live' ? (ro ? 'live acum' : 'live now') : module.status === 'new' ? (ro ? 'nou' : 'new') : (ro ? 'următorul pas' : 'next step')}
            </span>
          </article>
        ))}
      </section>

      <section className="two-col">
        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <p className="eyebrow">{ro ? 'Automation suite' : 'Automation suite'}</p>
              <h2 style={{ margin: 0 }}>{ro ? 'Flux de la lead la follow-up' : 'Lead-to-follow-up flow'}</h2>
              <div className="small muted">
                {ro ? 'Inspirat de Alpis + ClientFlow SaaS, pregătit pentru backend real.' : 'Inspired by Alpis + ClientFlow SaaS, ready for a real backend later.'}
              </div>
            </div>
          </div>
          <div className="flow-list">
            {automationFlows.map((item) => (
              <div className="flow-step" key={item.step}>
                <span>{item.step}</span>
                <strong>{item[language]}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <p className="eyebrow">{ro ? 'Demo Studio' : 'Demo Studio'}</p>
              <h2 style={{ margin: 0 }}>{ro ? 'Stiluri de prezentare' : 'Presentation styles'}</h2>
              <div className="small muted">
                {ro ? 'Din Link Video Editor Studio: fiecare produs are nevoie de o poveste demo clară.' : 'From Link Video Editor Studio: every product needs a clear demo story.'}
              </div>
            </div>
          </div>
          <div className="stack">
            {demoStyles.map((style) => <span className="stack-chip" key={style}>{style}</span>)}
          </div>
        </div>
      </section>

      <section className="card card-pad">
        <p className="eyebrow">{ro ? 'Nivelul următor' : 'Next level'}</p>
        <h2>{ro ? 'Ce transformă ClientFlow PRO într-un produs complet' : 'What turns ClientFlow PRO into a complete product'}</h2>
        <div className="suite-roadmap">
          {[
            ro ? 'Facturare print/PDF și duplicate detection' : 'Print/PDF invoicing and duplicate detection',
            ro ? 'Service templates + time tracking' : 'Service templates + time tracking',
            ro ? 'Client portal public simulat' : 'Simulated public client portal',
            ro ? 'Automation rules cu run manual' : 'Automation rules with manual run',
            ro ? 'Demo planner cu export markdown/JSON' : 'Demo planner with markdown/JSON export',
            ro ? 'Impact dashboard pentru obiective și progres' : 'Impact dashboard for goals and progress',
          ].map((item) => <div className="note" key={item}>✓ {item}</div>)}
        </div>
      </section>
    </div>
  )
}
