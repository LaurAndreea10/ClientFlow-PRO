import { Link } from 'react-router-dom'
import { DEMO_CREDENTIALS, loginAsDemo } from '../auth/demoAuth'
import { useNavigate } from 'react-router-dom'

const industries = [
  { title: 'Beauty / Salon', detail: 'Booking, stiliști, servicii, retenție VIP și agendă live.' },
  { title: 'Mecanic auto', detail: 'Fișă mașină, diagnoză, deviz, reparație și predare.' },
  { title: 'Kinetoterapeut', detail: 'Diagnostic, plan tratament, ședințe și progres pacient.' },
  { title: 'Psiholog', detail: 'Intake, consimțământ, tip ședință, confidențialitate și follow-up.' },
  { title: 'Personalizat', detail: 'Câmpuri, statusuri și etichete CRM complet configurabile.' },
]

const roles = [
  { title: 'Admin', detail: 'Acces total: adaugă, editează, șterge și gestionează permisiuni.' },
  { title: 'Angajat', detail: 'Vizualizează, adaugă și validează status client.' },
  { title: 'Angajat nou', detail: 'View only: poate explora workspace-ul fără modificări.' },
]

export function LandingPage() {
  const navigate = useNavigate()

  function startDemo() {
    loginAsDemo()
    navigate('/start-here')
  }

  return (
    <div className="auth-shell">
      <div className="grid" style={{ width: 'min(100%, 1180px)' }}>
        <section className="hero">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">ClientFlow PRO</p>
              <h1 className="page-title">CRM configurabil pe domeniu, cu roluri, automatizări și demo instant.</h1>
              <p className="muted" style={{ maxWidth: 720 }}>
                Creează un workspace pentru beauty, service auto, kinetoterapie, psihologie sau orice domeniu custom. Adminul stabilește roluri, permisiuni și trimite linkuri de acces pentru echipă.
              </p>
              <div className="toolbar" style={{ marginTop: 24 }}>
                <button className="button" onClick={startDemo}>Try Demo</button>
                <Link className="button secondary" to="/register">Create Workspace</Link>
                <Link className="button secondary" to="/login">Login</Link>
              </div>
            </div>
            <div className="readiness-card">
              <div className="small muted">Demo credentials</div>
              <h2 style={{ marginBottom: 8 }}>{DEMO_CREDENTIALS.email}</h2>
              <div className="pill">{DEMO_CREDENTIALS.password}</div>
              <p className="small muted" style={{ marginTop: 16 }}>Click Try Demo pentru acces instant la Start Here, Command Center, Workspace Access și Automations.</p>
            </div>
          </div>
        </section>

        <section className="suite-grid">
          {industries.map((item) => (
            <article className="card card-pad suite-card" key={item.title}>
              <div className="suite-icon">✦</div>
              <h2>{item.title}</h2>
              <p className="muted">{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="two-col">
          <div className="card card-pad">
            <p className="eyebrow">Roluri și accese</p>
            <h2>Permisiuni reale în UI</h2>
            <div className="list">
              {roles.map((role) => (
                <div className="note" key={role.title}>
                  <strong>{role.title}</strong>
                  <div className="small muted">{role.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <p className="eyebrow">Ce primești în demo</p>
            <h2>Suită completă local-first</h2>
            <div className="stack">
              {['Command Center', 'Global Search', 'Automations', 'Notifications', 'Invoices', 'Beauty Studio', 'Portal Preview', 'Portfolio Score', 'Backup / Restore', 'Supabase-ready'].map((item) => (
                <span className="stack-chip" key={item}>{item}</span>
              ))}
            </div>
            <p className="muted" style={{ marginTop: 18 }}>
              Totul rulează local în browser și este pregătit pentru migrare ulterioară la Supabase.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
