import { FormEvent, useMemo, useState } from 'react'
import { addSuiteItem, readSuiteCollection, updateSuiteItem, type Invoice } from '../lib/suiteStorage'
import { useLanguage } from '../lib/i18n'
import { can, getWorkspaceProfile } from '../lib/workspaceAccess'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function InvoicingPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const workspace = getWorkspaceProfile()
  const clientNoun = workspace?.clientLabel ?? (ro ? 'Client' : 'Client')
  const serviceNoun = workspace?.serviceLabel ?? (ro ? 'Serviciu' : 'Service')
  const canAdd = can('add')
  const canEdit = can('edit') || can('validateClientStatus')
  const [invoices, setInvoices] = useState<Invoice[]>(() => readSuiteCollection('invoices'))
  const [client, setClient] = useState('')
  const [service, setService] = useState('')
  const [amount, setAmount] = useState('0')
  const [dueDate, setDueDate] = useState(today())

  const totals = useMemo(() => ({
    revenue: invoices.filter((invoice) => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0),
    open: invoices.filter((invoice) => invoice.status !== 'paid').reduce((sum, invoice) => sum + invoice.amount, 0),
    paid: invoices.filter((invoice) => invoice.status === 'paid').length,
  }), [invoices])

  function refresh() {
    setInvoices(readSuiteCollection('invoices'))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canAdd) return
    addSuiteItem('invoices', { client, service, amount: Number(amount) || 0, dueDate, status: 'draft', createdAt: today() })
    setClient('')
    setService('')
    setAmount('0')
    setDueDate(today())
    refresh()
  }

  function setStatus(invoice: Invoice, status: Invoice['status']) {
    if (!canEdit) return
    updateSuiteItem('invoices', invoice.id, { status })
    refresh()
  }

  function printInvoice(invoice: Invoice) {
    const html = `<html><head><title>Invoice ${invoice.id}</title><style>body{font-family:Arial;padding:40px}h1{font-size:32px}.row{display:flex;justify-content:space-between;border-bottom:1px solid #ddd;padding:12px 0}</style></head><body><h1>ClientFlow PRO Invoice</h1><p>${invoice.client}</p><div class="row"><strong>${serviceNoun}</strong><span>${invoice.service}</span></div><div class="row"><strong>Amount</strong><span>€${invoice.amount}</span></div><div class="row"><strong>Status</strong><span>${invoice.status}</span></div><div class="row"><strong>Due</strong><span>${invoice.dueDate}</span></div></body></html>`
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.print()
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">{workspace?.customIndustry ?? workspace?.industry ?? (ro ? 'Facturare' : 'Invoicing')}</p>
          <h1 className="page-title">{ro ? 'Facturi și venituri' : 'Invoices and revenue'}</h1>
          <p className="muted">{workspace ? `Facturare adaptată pentru ${clientNoun} / ${serviceNoun}.` : ro ? 'Generează facturi locale, schimbă statusul și deschide layout print/PDF.' : 'Generate local invoices, change status and open a print/PDF-ready layout.'}</p>
        </div>
      </div>

      {!canAdd || !canEdit ? (
        <section className="card card-pad">
          <strong>Access mode</strong>
          <p className="small muted" style={{ marginBottom: 0 }}>Permisiuni active: {canAdd ? 'add ' : ''}{canEdit ? 'validate/edit' : ''}. Acțiunile fără permisiune sunt dezactivate.</p>
        </section>
      ) : null}

      <section className="grid stats">
        <div className="card card-pad stat-card"><div className="small muted">{ro ? 'Facturi' : 'Invoices'}</div><div className="stat-value">{invoices.length}</div><div className="stat-change">local</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{ro ? 'Plătite' : 'Paid'}</div><div className="stat-value">{totals.paid}</div><div className="stat-change">status tracking</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{ro ? 'Venit încasat' : 'Collected'}</div><div className="stat-value">€{totals.revenue}</div><div className="stat-change">paid invoices</div></div>
        <div className="card card-pad stat-card"><div className="small muted">{ro ? 'Deschis' : 'Open'}</div><div className="stat-value">€{totals.open}</div><div className="stat-change">draft + sent</div></div>
      </section>

      <section className="two-col">
        <div className="card card-pad">
          <div className="card-title-row"><h2 style={{ margin: 0 }}>{ro ? 'Registru facturi' : 'Invoice register'}</h2><span className="pill">PDF print</span></div>
          <div className="list">
            {invoices.map((invoice) => (
              <div className="note" key={invoice.id}>
                <div className="card-title-row">
                  <div><strong>{invoice.client}</strong><div className="small muted">{invoice.service} · due {invoice.dueDate}</div></div>
                  <span className={`badge ${invoice.status === 'paid' ? 'active' : invoice.status === 'sent' ? 'high' : 'medium'}`}>{invoice.status}</span>
                </div>
                <div className="toolbar">
                  <strong>€{invoice.amount}</strong>
                  <button className="button secondary" disabled={!canEdit} onClick={() => setStatus(invoice, 'sent')}>Sent</button>
                  <button className="button secondary" disabled={!canEdit} onClick={() => setStatus(invoice, 'paid')}>Paid</button>
                  <button className="button" onClick={() => printInvoice(invoice)}>{ro ? 'Printează' : 'Print'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="card card-pad">
          <h2>{ro ? 'Factură nouă' : 'New invoice'}</h2>
          <p className="small muted">{canAdd ? (ro ? 'Creează factură pentru domeniul configurat.' : 'Create an invoice for the configured industry.') : 'View-only access: creare dezactivată.'}</p>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder={clientNoun} value={client} onChange={(e) => setClient(e.target.value)} required disabled={!canAdd} />
            <input className="input" placeholder={serviceNoun} value={service} onChange={(e) => setService(e.target.value)} required disabled={!canAdd} />
            <input className="input" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={!canAdd} />
            <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={!canAdd} />
            <button className="button" disabled={!canAdd}>{ro ? 'Creează factură' : 'Create invoice'}</button>
          </form>
        </aside>
      </section>
    </div>
  )
}
