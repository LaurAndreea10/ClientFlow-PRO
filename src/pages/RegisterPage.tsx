import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../lib/mockApi'
import { createWorkspaceProfile, industryTemplates, type IndustryKey } from '../lib/workspaceAccess'

const industries: { key: IndustryKey; label: string; description: string }[] = [
  { key: 'beauty', label: 'Beauty / Salon', description: 'Programări, servicii, stiliști, retenție VIP.' },
  { key: 'auto', label: 'Mecanic auto', description: 'Diagnoză, devize, intervenții, predare mașină.' },
  { key: 'kineto', label: 'Kinetoterapeut', description: 'Evaluări, plan tratament, ședințe, reevaluări.' },
  { key: 'psychology', label: 'Psiholog', description: 'Intake, ședințe, consimțământ, follow-up.' },
  { key: 'custom', label: 'Personalizat', description: 'Configurezi propriile câmpuri și etichete CRM.' },
]

export function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('Laura Andreea')
  const [email, setEmail] = useState('laura@example.com')
  const [password, setPassword] = useState('123456')
  const [workspaceName, setWorkspaceName] = useState('ClientFlow Workspace')
  const [industry, setIndustry] = useState<IndustryKey>('beauty')
  const [customIndustry, setCustomIndustry] = useState('')
  const [clientLabel, setClientLabel] = useState(industryTemplates.beauty.clientLabel)
  const [serviceLabel, setServiceLabel] = useState(industryTemplates.beauty.serviceLabel)
  const [loading, setLoading] = useState(false)

  function handleIndustryChange(next: IndustryKey) {
    setIndustry(next)
    setClientLabel(industryTemplates[next].clientLabel)
    setServiceLabel(industryTemplates[next].serviceLabel)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    await register(fullName, email, password)
    createWorkspaceProfile({
      name: workspaceName,
      ownerName: fullName,
      ownerEmail: email,
      industry,
      customIndustry,
      clientLabel,
      serviceLabel,
    })
    navigate('/workspace-setup')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ width: 'min(100%, 1180px)' }}>
        <section className="auth-showcase">
          <p className="eyebrow">Workspace onboarding</p>
          <h1 className="page-title" style={{ fontSize: '3rem' }}>Creează CRM-ul pentru domeniul tău.</h1>
          <p className="muted" style={{ maxWidth: 560 }}>
            Alege domeniul de activitate, personalizează etichetele CRM și pornește cu rol Admin. După creare poți invita angajați cu permisiuni controlate.
          </p>

          <div className="auth-feature-list">
            {industries.map((item) => (
              <button
                className={`auth-feature ${industry === item.key ? 'active' : ''}`}
                key={item.key}
                onClick={() => handleIndustryChange(item.key)}
                type="button"
                style={{ textAlign: 'left' }}
              >
                <strong>{item.label}</strong>
                <div className="small muted">{item.description}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="auth-form-panel">
          <p className="eyebrow">Create admin account</p>
          <h2 className="page-title" style={{ fontSize: '2.4rem' }}>Start workspace</h2>
          <p className="muted">Adminul primește acces total: editează, modifică, șterge, adaugă permisiuni și creează invitații.</p>

          <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nume admin" />
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email admin" />
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Parolă" />
            <input className="input" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} placeholder="Nume workspace" />
            {industry === 'custom' ? (
              <input className="input" value={customIndustry} onChange={(e) => setCustomIndustry(e.target.value)} placeholder="Domeniu personalizat" />
            ) : null}
            <div className="split-stats">
              <input className="input" value={clientLabel} onChange={(e) => setClientLabel(e.target.value)} placeholder="Etichetă client" />
              <input className="input" value={serviceLabel} onChange={(e) => setServiceLabel(e.target.value)} placeholder="Etichetă serviciu" />
            </div>
            <button className="button" disabled={loading}>{loading ? 'Creating...' : 'Create workspace as Admin'}</button>
          </form>

          <p className="small muted" style={{ marginTop: 16 }}>
            Already have an account? <Link to="/login"><strong>Sign in</strong></Link>
          </p>
        </section>
      </div>
    </div>
  )
}
