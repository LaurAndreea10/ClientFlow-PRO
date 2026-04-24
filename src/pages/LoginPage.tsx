import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../lib/mockApi'
import { DEMO_CREDENTIALS } from '../auth/demoAuth'

export function LoginPage() {
  const navigate = useNavigate()
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
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  async function handleDemo() {
    setError('')
    setLoading(true)

    try {
      await login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start demo mode')
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
          <p className="eyebrow">Portfolio-ready app</p>
          <h1 className="page-title" style={{ fontSize: '3.2rem' }}>Manage clients like a real product.</h1>
          <p className="muted" style={{ maxWidth: 520 }}>
            This version is optimized for GitHub portfolio use: polished dashboard, realistic CRM flows, and no mandatory external services.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <strong>Local-first data</strong>
              <div className="small muted">Everything works in the browser, so there are no required monthly costs.</div>
            </div>
            <div className="auth-feature">
              <strong>Real app structure</strong>
              <div className="small muted">Routing, auth gate, CRUD flows, notes, charts and dashboard states.</div>
            </div>
            <div className="auth-feature">
              <strong>Easy upgrade path</strong>
              <div className="small muted">You can later replace mock storage with Supabase or another free backend.</div>
            </div>
          </div>

          <div className="stack" style={{ marginTop: 22 }}>
            {['React', 'TypeScript', 'Vite', 'React Query', 'Recharts', 'localStorage'].map((item) => (
              <span key={item} className="stack-chip">{item}</span>
            ))}
          </div>
        </section>

        <section className="auth-form-panel">
          <p className="eyebrow">Welcome back</p>
          <h2 className="page-title" style={{ fontSize: '2.4rem' }}>Sign in</h2>
          <p className="muted">No account needed — try the demo workspace.</p>

          <div className="sidebar-panel" style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700 }}>Demo Mode</div>
                <p className="small muted" style={{ marginTop: 6, marginBottom: 0 }}>
                  Explore clients, tasks, reports, calendar, kanban and settings. Changes are saved locally in this browser.
                </p>
              </div>
              <span className="pill" style={{ whiteSpace: 'nowrap' }}>No signup</span>
            </div>

            <button className="button" type="button" onClick={handleDemo} disabled={loading} style={{ width: '100%', marginTop: 16 }}>
              Try Demo →
            </button>

            <div className="small muted" style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span>Or use demo credentials:</span>
                <button className="text-button" type="button" onClick={fillDemoCredentials}>
                  Autofill
                </button>
              </div>
              <div style={{ fontFamily: 'monospace', marginTop: 6 }}>
                {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
              </div>
            </div>
          </div>

          <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            {error && (
              <div className="small" role="alert" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.16)', borderRadius: 12, padding: '10px 12px' }}>
                {error}
              </div>
            )}
            <button className="button secondary" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          </form>

          <p className="small muted" style={{ marginTop: 16 }}>
            No account yet? <Link to="/register"><strong>Create one</strong></Link>
          </p>
        </section>
      </div>
    </div>
  )
}
