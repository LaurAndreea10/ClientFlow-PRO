import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DEMO_CREDENTIALS } from '../auth/demoAuth'
import { useLanguage } from '../lib/i18n'
import { login } from '../lib/mockApi'

const demoPath = ['Start Here', 'Command Center', 'Clients / Tasks', 'Automations', 'Portfolio Score']

export function LoginPage() {
  const navigate = useNavigate()
  const { copy } = useLanguage()
  const t = copy.login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/start-here')
    } catch (err) {
      setError(err instanceof Error ? err.message : t.credentialsError)
    } finally {
      setLoading(false)
    }
  }

  async function handleDemo() {
    setError('')
    setLoading(true)

    try {
      await login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)
      navigate('/start-here')
    } catch (err) {
      setError(err instanceof Error ? err.message : t.demoError)
    } finally {
      setLoading(false)
    }
  }

  function fillDemoCredentials() {
    setEmail(DEMO_CREDENTIALS.email)
    setPassword(DEMO_CREDENTIALS.password)
    setError('')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <section className="auth-showcase">
          <p className="eyebrow">Portfolio-grade CRM prototype</p>
          <h1 className="page-title" style={{ fontSize: '3.2rem' }}>ClientFlow PRO</h1>
          <p className="muted" style={{ maxWidth: 540 }}>
            Local-first CRM and operations demo with configurable industries, role-based workflows, automations, invoices and Supabase-ready architecture.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <strong>Industry-aware CRM</strong>
              <div className="small muted">Beauty, auto service, kineto, psychology and custom workspaces.</div>
            </div>
            <div className="auth-feature">
              <strong>Role-based workflows</strong>
              <div className="small muted">Admin, employee and view-only access with disabled actions by permission.</div>
            </div>
            <div className="auth-feature">
              <strong>Portfolio demo, not a barrier</strong>
              <div className="small muted">Open the guided tour in one click and review the full product story.</div>
            </div>
          </div>

          <div className="stack" style={{ marginTop: 22 }}>
            {['React', 'TypeScript', 'Vite', 'React Query', 'PWA', 'localStorage'].map((item) => (
              <span key={item} className="stack-chip">{item}</span>
            ))}
          </div>
        </section>

        <section className="auth-form-panel">
          <p className="eyebrow">Live portfolio demo</p>
          <h2 className="page-title" style={{ fontSize: '2.35rem' }}>Try Demo — no account needed</h2>
          <p className="muted">Explore CRM, automations, invoices and role-based workflows in a guided demo workspace.</p>

          <div className="sidebar-panel" style={{ marginTop: 22, border: '1px solid rgba(34, 197, 94, 0.28)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.08rem' }}>Demo workspace</div>
                <p className="small muted" style={{ marginTop: 6, marginBottom: 0 }}>
                  Demo data is stored only in your browser. No real account or backend required.
                </p>
              </div>
              <span className="pill" style={{ whiteSpace: 'nowrap' }}>No signup</span>
            </div>

            <button className="button" type="button" onClick={handleDemo} disabled={loading} style={{ width: '100%', marginTop: 16, fontSize: '1rem' }}>
              {loading ? 'Opening demo…' : 'Try Demo →'}
            </button>

            <div className="note" style={{ marginTop: 16 }}>
              <div className="small muted">Demo credentials</div>
              <div style={{ display: 'grid', gap: 6, marginTop: 8, fontFamily: 'monospace' }}>
                <span>Email: {DEMO_CREDENTIALS.email}</span>
                <span>Password: {DEMO_CREDENTIALS.password}</span>
              </div>
              <button className="text-button" type="button" onClick={fillDemoCredentials} style={{ marginTop: 10 }}>
                Autofill credentials
              </button>
            </div>
          </div>

          <div className="card card-pad" style={{ marginTop: 18 }}>
            <div className="card-title-row">
              <div>
                <strong>Recommended 3-minute tour</strong>
                <div className="small muted">Follow this path after clicking Try Demo.</div>
              </div>
              <span className="pill">Demo path</span>
            </div>
            <div className="stack" style={{ marginTop: 14 }}>
              {demoPath.map((item) => <span className="stack-chip" key={item}>{item}</span>)}
            </div>
          </div>

          <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <div className="small muted">Manual sign-in</div>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.email} required />
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.password} required />
            {error && (
              <div className="small" role="alert" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.16)', borderRadius: 12, padding: '10px 12px' }}>
                {error}
              </div>
            )}
            <button className="button secondary" disabled={loading}>{loading ? t.signingIn : t.signIn}</button>
          </form>

          <p className="small muted" style={{ marginTop: 16 }}>
            Want to configure your own workspace? <Link to="/register"><strong>Create workspace</strong></Link>
          </p>
        </section>
      </div>
    </div>
  )
}
