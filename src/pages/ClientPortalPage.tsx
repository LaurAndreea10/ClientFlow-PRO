import { FormEvent, useState } from 'react'
import { addSuiteItem, readSuiteCollection, type PortalItem } from '../lib/suiteStorage'
import { useLanguage } from '../lib/i18n'

export function ClientPortalPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const [portals, setPortals] = useState<PortalItem[]>(() => readSuiteCollection('portals'))
  const [client, setClient] = useState('')
  const [sections, setSections] = useState('Tasks, Invoices, Timeline')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    addSuiteItem('portals', {
      client,
      accessCode: client.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'CLIENT',
      status: 'preview',
      visibleSections: sections.split(',').map((item) => item.trim()).filter(Boolean),
    })
    setPortals(readSuiteCollection('portals'))
    setClient('')
    setSections('Tasks, Invoices, Timeline')
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">{ro ? 'Portal client' : 'Client portal'}</p>
          <h1 className="page-title">{ro ? 'Preview pentru acces client' : 'Client-facing preview'}</h1>
          <p className="muted">{ro ? 'Simulează linkuri și secțiuni vizibile pentru clienți fără backend public.' : 'Simulate client links and visible sections without a public backend.'}</p>
        </div>
        <div className="pill">{ro ? 'Simulat local' : 'Local simulation'}</div>
      </div>

      <section className="two-col">
        <div className="card card-pad">
          <h2>{ro ? 'Portaluri' : 'Portals'}</h2>
          <div className="list">
            {portals.map((portal) => (
              <article className="note" key={portal.id}>
                <div className="card-title-row">
                  <div><strong>{portal.client}</strong><div className="small muted">/#/portal/{portal.accessCode.toLowerCase()}</div></div>
                  <span className={`badge ${portal.status === 'active' ? 'active' : 'medium'}`}>{portal.status}</span>
                </div>
                <div className="stack">
                  {portal.visibleSections.map((section) => <span className="stack-chip" key={section}>{section}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="card card-pad">
          <h2>{ro ? 'Portal nou' : 'New portal'}</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder={ro ? 'Client' : 'Client'} value={client} onChange={(e) => setClient(e.target.value)} required />
            <input className="input" placeholder={ro ? 'Secțiuni vizibile' : 'Visible sections'} value={sections} onChange={(e) => setSections(e.target.value)} />
            <button className="button">{ro ? 'Generează preview' : 'Generate preview'}</button>
          </form>
        </aside>
      </section>
    </div>
  )
}
