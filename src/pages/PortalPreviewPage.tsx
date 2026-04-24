import { Link, useParams } from 'react-router-dom'
import { readSuiteCollection } from '../lib/suiteStorage'

export function PortalPreviewPage() {
  const { code = '' } = useParams()
  const portals = readSuiteCollection('portals')
  const invoices = readSuiteCollection('invoices')
  const demos = readSuiteCollection('demos')
  const portal = portals.find((item) => item.accessCode.toLowerCase() === code.toLowerCase()) ?? portals[0]
  const clientInvoices = invoices.filter((invoice) => invoice.client.toLowerCase().includes(portal.client.toLowerCase().split(' ')[0]))

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ width: 'min(100%, 1180px)' }}>
        <section className="auth-showcase">
          <p className="eyebrow">Client portal preview</p>
          <h1 className="page-title" style={{ fontSize: '3rem' }}>{portal.client}</h1>
          <p className="muted" style={{ maxWidth: 560 }}>
            A simulated public client portal showing what a customer could see without entering the internal workspace.
          </p>
          <div className="stack" style={{ marginTop: 24 }}>
            {portal.visibleSections.map((section) => <span className="stack-chip" key={section}>{section}</span>)}
          </div>
          <Link className="button secondary" to="/portal" style={{ marginTop: 24, display: 'inline-flex' }}>Back to internal portal manager</Link>
        </section>
        <section className="auth-form-panel">
          <div className="grid">
            <div className="card card-pad">
              <div className="small muted">Access code</div>
              <h2 style={{ marginTop: 8 }}>{portal.accessCode}</h2>
              <span className={`badge ${portal.status === 'active' ? 'active' : 'medium'}`}>{portal.status}</span>
            </div>
            <div className="card card-pad">
              <h2>Invoices</h2>
              <div className="list">
                {(clientInvoices.length ? clientInvoices : invoices.slice(0, 2)).map((invoice) => (
                  <div className="note" key={invoice.id}>
                    <div className="card-title-row">
                      <div><strong>{invoice.service}</strong><div className="small muted">Due {invoice.dueDate}</div></div>
                      <span className="badge active">€{invoice.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card card-pad">
              <h2>Project timeline</h2>
              <div className="list">
                {demos[0]?.shots.slice(0, 4).map((shot) => <div className="note" key={shot}>✓ {shot}</div>)}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
