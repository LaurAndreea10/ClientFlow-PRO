import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../lib/mockApi'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('demo@clientflow.local')
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
        <h1 className="page-title" style={{ fontSize: '2rem' }}>Welcome back</h1>
        <p className="muted">Sign in with any email and password. This version is fully local and free.</p>

        <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button className="button" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>

        <p className="small muted" style={{ marginTop: 16 }}>
          No account yet? <Link to="/register"><strong>Create one</strong></Link>
        </p>
      </div>
    </div>
  )
}