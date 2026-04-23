import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../lib/mockApi'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('laura@example.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    await login(email, password)
    navigate('/dashboard')
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
          <p className="muted">Use the prefilled demo credentials or type anything you want.</p>

          <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button className="button" disabled={loading}>{loading ? 'Signing in...' : 'Enter dashboard'}</button>
          </form>

          <p className="small muted" style={{ marginTop: 16 }}>
            No account yet? <Link to="/register"><strong>Create one</strong></Link>
          </p>
        </section>
      </div>
    </div>
  )
}
