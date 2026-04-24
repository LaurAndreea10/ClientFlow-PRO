import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DEMO_CREDENTIALS } from '../auth/demoAuth'
import { useLanguage } from '../lib/i18n'
import { login } from '../lib/mockApi'

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
      navigate('/dashboard')
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
      navigate('/dashboard')
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
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="page-title" style={{ fontSize: '3.2rem' }}>{t.title}</h1>
          <p className="muted" style={{ maxWidth: 520 }}>
            {t.description}
          </p>

          <div className="auth-feature-list">
            {t.features.map(([title, description]) => (
              <div className="auth-feature" key={title}>
                <strong>{title}</strong>
                <div className="small muted">{description}</div>
              </div>
            ))}
          </div>

          <div className="stack" style={{ marginTop: 22 }}>
            {['React', 'TypeScript', 'Vite', 'React Query', 'Recharts', 'localStorage'].map((item) => (
              <span key={item} className="stack-chip">{item}</span>
            ))}
          </div>
        </section>

        <section className="auth-form-panel">
          <p className="eyebrow">{t.welcome}</p>
          <h2 className="page-title" style={{ fontSize: '2.4rem' }}>{t.signIn}</h2>
          <p className="muted">{t.noAccountNeeded}</p>

          <div className="sidebar-panel" style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{t.demoMode}</div>
                <p className="small muted" style={{ marginTop: 6, marginBottom: 0 }}>
                  {t.demoDescription}
                </p>
              </div>
              <span className="pill" style={{ whiteSpace: 'nowrap' }}>{t.noSignup}</span>
            </div>

            <button className="button" type="button" onClick={handleDemo} disabled={loading} style={{ width: '100%', marginTop: 16 }}>
              {t.tryDemo}
            </button>

            <div className="small muted" style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span>{t.demoCredentials}</span>
                <button className="text-button" type="button" onClick={fillDemoCredentials}>
                  {t.autofill}
                </button>
              </div>
              <div style={{ fontFamily: 'monospace', marginTop: 6 }}>
                {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
              </div>
            </div>
          </div>

          <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
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
            {t.noAccount} <Link to="/register"><strong>{t.createOne}</strong></Link>
          </p>
        </section>
      </div>
    </div>
  )
}
