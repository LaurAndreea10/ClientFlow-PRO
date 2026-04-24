import { FormEvent, useState } from 'react'
import { addSuiteItem, readSuiteCollection, type PortalItem } from '../lib/suiteStorage'
import { useLanguage } from '../lib/i18n'
import { can, getWorkspaceProfile } from '../lib/workspaceAccess'

export function ClientPortalPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const workspace = getWorkspaceProfile()
  const clientNoun = workspace?.clientLabel ?? (ro ? 'Client' : 'Client')
  const canAdd = can('add')
  const [portals, setPortals] = useState<PortalItem[]>(() => readSuiteCollection('portals'))
  const [client, setClient] = useState('')
  const [sections, setSections] = useState('Tasks, Invoices, Timeline')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canAdd) return
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
          <p className="eyebrow">{workspace?.customIndustry ?? workspace?.industry ?? (ro ? 'Portal client' : 'Client portal')}</p>
          <h1 className="page-title">{ro ? 'Preview pentru acces client' : 'Client-facing preview'}</h1>
          <p className="muted">{ro ? `Simulează linkuri și secțiuni vizibile pentru ${clientNoun}.` : `Simulate visible sections for ${clientNoun}.`}</p>
        </div>
        <div className="pill">{ro ? 'Simulat local' : 'Local simulation'}</div>
      </div>

      {!canAdd ? <section className="card card-pad"><strong>View-only access</strong><p className="small muted" style={{ marginBottom: 0 }}>Crearea de portaluri este dezactivată pentru rolul curent.</p></section> : null}

      <section className="two-col">
        <div className="card card-pad">
          <h2>{ro ? 'Portaluri' : 'Portals'}</h2>
          <div className="list">
            {portals.map((portal) => (
              <article className="note" key={portal.id}>
                <div className="card-title-row">
                  <div><strong>{portal.client}</strong><div className="small muted">/#/portal-preview/{portal.accessCode}</div></div>
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
            <input className="input" placeholder={clientNoun} value={client} onChange={(e) => setClient(e.target.value)} required disabled={!canAdd} />
            <input className="input" placeholder={ro ? 'Secțiuni vizibile' : 'Visible sections'} value={sections} onChange={(e) => setSections(e.target.value)} disabled={!canAdd} />
            <button className="button" disabled={!canAdd}>{ro ? 'Generează preview' : 'Generate preview'}</button>
          </form>
        </aside>
      </section>
    </div>
  )
}
