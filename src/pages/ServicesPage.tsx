import { FormEvent, useState } from 'react'
import { addSuiteItem, readSuiteCollection, type ServiceTemplate } from '../lib/suiteStorage'
import { useLanguage } from '../lib/i18n'

export function ServicesPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const [services, setServices] = useState<ServiceTemplate[]>(() => readSuiteCollection('services'))
  const [name, setName] = useState('')
  const [price, setPrice] = useState('0')
  const [duration, setDuration] = useState('')
  const [deliverables, setDeliverables] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    addSuiteItem('services', { name, price: Number(price) || 0, duration, deliverables })
    setServices(readSuiteCollection('services'))
    setName('')
    setPrice('0')
    setDuration('')
    setDeliverables('')
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">{ro ? 'Template-uri servicii' : 'Service templates'}</p>
          <h1 className="page-title">{ro ? 'Pachete reutilizabile' : 'Reusable packages'}</h1>
          <p className="muted">{ro ? 'Standardizează ofertele, prețurile, duratele și livrabilele.' : 'Standardize offers, pricing, duration and deliverables.'}</p>
        </div>
        <div className="pill">{services.length} templates</div>
      </div>

      <section className="two-col">
        <div className="card card-pad">
          <div className="suite-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {services.map((service) => (
              <article className="suite-card card-pad" key={service.id}>
                <div className="suite-icon">🧾</div>
                <div className="small muted">{service.duration}</div>
                <h2>{service.name}</h2>
                <p className="muted">{service.deliverables}</p>
                <span className="badge active">€{service.price}</span>
              </article>
            ))}
          </div>
        </div>
        <aside className="card card-pad">
          <h2>{ro ? 'Template nou' : 'New template'}</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder={ro ? 'Nume pachet' : 'Package name'} value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="input" type="number" placeholder={ro ? 'Preț' : 'Price'} value={price} onChange={(e) => setPrice(e.target.value)} />
            <input className="input" placeholder={ro ? 'Durată' : 'Duration'} value={duration} onChange={(e) => setDuration(e.target.value)} />
            <textarea className="textarea" placeholder={ro ? 'Livrabile' : 'Deliverables'} value={deliverables} onChange={(e) => setDeliverables(e.target.value)} rows={4} />
            <button className="button">{ro ? 'Salvează template' : 'Save template'}</button>
          </form>
        </aside>
      </section>
    </div>
  )
}
