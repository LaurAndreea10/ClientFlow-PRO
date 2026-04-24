import { useParams, Link, useNavigate } from 'react-router-dom'
import { acceptAccess, getWorkspaceProfile, rolePresets } from '../lib/workspaceAccess'

export function AcceptAccessPage() {
  const { accessId = '' } = useParams()
  const navigate = useNavigate()
  const workspace = getWorkspaceProfile()
  const access = acceptAccess(accessId)

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <section className="auth-showcase">
          <p className="eyebrow">ClientFlow PRO Access</p>
          <h1 className="page-title" style={{ fontSize: '3rem' }}>{access ? 'Acces activat' : 'Link invalid'}</h1>
          <p className="muted" style={{ maxWidth: 520 }}>
            {access
              ? `Ai primit acces în workspace-ul ${workspace?.name ?? 'ClientFlow PRO'}. Rol: ${rolePresets[access.role].label}.`
              : 'Nu am găsit acest link de acces în browserul curent. Cere adminului să genereze un link nou.'}
          </p>
        </section>

        <section className="auth-form-panel">
          {access ? (
            <div className="grid">
              <div className="card card-pad">
                <div className="small muted">Nume</div>
                <h2>{access.name}</h2>
                <div className="small muted">{access.email}</div>
              </div>
              <div className="card card-pad">
                <div className="small muted">Permisiuni</div>
                <div className="stack" style={{ marginTop: 12 }}>
                  {access.permissions.map((permission) => <span className="stack-chip" key={permission}>{permission}</span>)}
                </div>
              </div>
              <button className="button" onClick={() => navigate('/dashboard')}>Intră în ClientFlow PRO</button>
            </div>
          ) : (
            <Link className="button" to="/login">Înapoi la login</Link>
          )}
        </section>
      </div>
    </div>
  )
}
