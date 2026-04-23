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
        <h1 className="page-title" style={{ fontSize: '2rem' }}>Create account</h1>
        <p className="muted">This starter stores demo data locally, so there are no required service costs.</p>

        <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button className="button" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        </form>

        <p className="small muted" style={{ marginTop: 16 }}>
          Already have an account? <Link to="/login"><strong>Sign in</strong></Link>
        </p>
      </div>
    </div>
  )
}