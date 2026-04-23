import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="page-title">404</h1>
        <p className="muted">This page does not exist.</p>
        <div style={{ marginTop: 20 }}>
          <Link className="button" to="/dashboard">Go to dashboard</Link>
        </div>
      </div>
    </div>
  )
}