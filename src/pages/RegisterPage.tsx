import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../lib/mockApi'

export function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('Laura Andreea')
  const [email, setEmail] = useState('laura@example.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    await register(fullName, email, password)
    navigate('/dashboard')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <section className="auth-showcase">
          <p className="eyebrow">Free starter</p>
          <h1 className="page-title" style={{ fontSize: '3rem' }}>Create your workspace.</h1>
          <p className="muted" style={{ maxWidth: 520 }}>
            This starter saves demo auth and app data locally so you can build, present and iterate without adding paid infrastructure.
          </p>

          <div className="split-stats" style={{ marginTop: 24 }}>
            <div className="kpi-mini">
              <div className="small muted">Monthly cost required</div>
              <div className="stat-value" style={{ fontSize: '1.8rem' }}>€0</div>
            </div>
            <div className="kpi-mini">
              <div className="small muted">Ready modules</div>
              <div className="stat-value" style={{ fontSize: '1.8rem' }}>5+</div>
            </div>
          </div>
        </section>

        <section className="auth-form-panel">
          <p className="eyebrow">Create account</p>
          <h2 className="page-title" style={{ fontSize: '2.4rem' }}>Start free</h2>
          <p className="muted">Your account is demo-only and lives in the browser for this version.</p>

          <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button className="button" disabled={loading}>{loading ? 'Creating...' : 'Create workspace'}</button>
          </form>

          <p className="small muted" style={{ marginTop: 16 }}>
            Already have an account? <Link to="/login"><strong>Sign in</strong></Link>
          </p>
        </section>
      </div>
    </div>
  )
}
