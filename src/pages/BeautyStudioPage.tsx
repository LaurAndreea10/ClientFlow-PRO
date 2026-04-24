import { FormEvent, useMemo, useState } from 'react'
import { addSuiteItem, readSuiteCollection, updateSuiteItem, type BeautyBooking } from '../lib/suiteStorage'
import { useLanguage } from '../lib/i18n'

const services = ['Hair Styling', 'Color & Balayage', 'Nails Signature', 'Make-up', 'Facial Treatment', 'Brows & Lashes']
const stylists = ['Elena', 'Daria', 'Mara', 'Andreea']
const slots = ['09:00', '10:00', '11:30', '12:30', '14:00', '15:00', '16:30']

function todayPlus(days: number) {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10)
}

export function BeautyStudioPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const [bookings, setBookings] = useState<BeautyBooking[]>(() => readSuiteCollection('beauty'))
  const [client, setClient] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState(services[0])
  const [stylist, setStylist] = useState(stylists[0])
  const [date, setDate] = useState(todayPlus(7))
  const [time, setTime] = useState(slots[1])
  const [notes, setNotes] = useState('')

  const stats = useMemo(() => ({
    revenue: bookings.reduce((sum, booking) => sum + booking.spend, 0),
    vip: bookings.filter((booking) => booking.retentionLabel === 'VIP').length,
    pending: bookings.filter((booking) => booking.status === 'pending').length,
    followUps: bookings.filter((booking) => booking.status === 'vip-follow-up').length,
  }), [bookings])

  function refresh() {
    setBookings(readSuiteCollection('beauty'))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    addSuiteItem('beauty', {
      client,
      email,
      phone,
      service,
      stylist,
      date,
      time,
      status: 'pending',
      spend: service.includes('Color') ? 240 : service.includes('Nails') ? 85 : 140,
      notes,
      retentionLabel: 'New',
    })
    setClient('')
    setEmail('')
    setPhone('')
    setNotes('')
    refresh()
  }

  function setStatus(booking: BeautyBooking, status: BeautyBooking['status']) {
    updateSuiteItem('beauty', booking.id, { status })
    refresh()
  }

  function exportCsv() {
    const header = ['Client', 'Email', 'Phone', 'Service', 'Stylist', 'Date', 'Time', 'Status', 'Spend', 'Retention']
    const rows = bookings.map((booking) => [booking.client, booking.email, booking.phone, booking.service, booking.stylist, booking.date, booking.time, booking.status, String(booking.spend), booking.retentionLabel])
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'beauty-studio-bookings.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid beauty-page">
      <section className="hero beauty-hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Beautyus Premium Layer</p>
            <h1 className="page-title">{ro ? 'Booking, retenție și revenue pentru servicii premium.' : 'Booking, retention and revenue for premium service businesses.'}</h1>
            <p className="muted" style={{ maxWidth: 700 }}>
              {ro
                ? 'Inspirat de Beautyus: catalog servicii, programări, agendă live, client desk, follow-up automat și pipeline de retenție VIP.'
                : 'Inspired by Beautyus: service catalog, bookings, live agenda, client desk, automated follow-up and VIP retention pipeline.'}
            </p>
          </div>
          <div className="kpi-strip">
            <div className="kpi-mini"><div className="small muted">{ro ? 'Revenue' : 'Revenue'}</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>€{stats.revenue}</div></div>
            <div className="kpi-mini"><div className="small muted">VIP</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>{stats.vip}</div></div>
            <div className="kpi-mini"><div className="small muted">{ro ? 'Follow-up' : 'Follow-up'}</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>{stats.followUps}</div></div>
          </div>
        </div>
      </section>

      <section className="two-col">
        <aside className="card card-pad beauty-booking-card">
          <div className="card-title-row">
            <div>
              <p className="eyebrow">{ro ? 'Widget booking' : 'Booking widget'}</p>
              <h2 style={{ margin: 0 }}>{ro ? 'Programare nouă' : 'New appointment'}</h2>
            </div>
            <span className="pill">{ro ? 'Client-facing' : 'Client-facing'}</span>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <select className="select" value={service} onChange={(event) => setService(event.target.value)}>
              {services.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select className="select" value={stylist} onChange={(event) => setStylist(event.target.value)}>
              {stylists.map((item) => <option key={item}>{item}</option>)}
            </select>
            <input className="input" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            <select className="select" value={time} onChange={(event) => setTime(event.target.value)}>
              {slots.map((slot) => <option key={slot}>{slot}</option>)}
            </select>
            <input className="input" placeholder={ro ? 'Nume client' : 'Client name'} value={client} onChange={(event) => setClient(event.target.value)} required />
            <input className="input" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <input className="input" placeholder={ro ? 'Telefon' : 'Phone'} value={phone} onChange={(event) => setPhone(event.target.value)} />
            <textarea className="textarea" placeholder={ro ? 'Note preferințe' : 'Preference notes'} value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
            <button className="button">{ro ? 'Confirmă programare' : 'Confirm booking'}</button>
          </form>
        </aside>

        <div className="card card-pad">
          <div className="card-title-row">
            <div>
              <p className="eyebrow">{ro ? 'Agendă live' : 'Live agenda'}</p>
              <h2 style={{ margin: 0 }}>{ro ? 'Calendar salon' : 'Studio calendar'}</h2>
              <div className="small muted">{ro ? 'Sloturi pe stilist, status și follow-up.' : 'Slots by stylist, status and follow-up.'}</div>
            </div>
            <button className="button secondary" onClick={exportCsv}>CSV</button>
          </div>
          <div className="list">
            {bookings.map((booking) => (
              <article className="note beauty-appointment" key={booking.id}>
                <div className="card-title-row">
                  <div>
                    <strong>{booking.time} · {booking.client}</strong>
                    <div className="small muted">{booking.service} with {booking.stylist} · {booking.date}</div>
                  </div>
                  <span className={`badge ${booking.status === 'booked' || booking.status === 'completed' ? 'active' : booking.status === 'vip-follow-up' ? 'high' : 'medium'}`}>{booking.status}</span>
                </div>
                <div className="task-meta-row">
                  <span className="badge">€{booking.spend}</span>
                  <span className="badge">{booking.retentionLabel}</span>
                  <span className="badge">{booking.phone}</span>
                </div>
                <p className="small muted">{booking.notes}</p>
                <div className="toolbar">
                  <button className="button secondary" onClick={() => setStatus(booking, 'booked')}>{ro ? 'Confirmă' : 'Book'}</button>
                  <button className="button secondary" onClick={() => setStatus(booking, 'completed')}>{ro ? 'Finalizat' : 'Complete'}</button>
                  <button className="button secondary" onClick={() => setStatus(booking, 'vip-follow-up')}>VIP follow-up</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid stats">
        <div className="card card-pad stat-card"><div className="small muted">24h</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>{ro ? 'Reminder' : 'Reminder'}</div><div className="stat-change">{ro ? 'înainte de programare' : 'before appointment'}</div></div>
        <div className="card card-pad stat-card"><div className="small muted">Post-visit</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>{ro ? 'Review' : 'Review'}</div><div className="stat-change">{ro ? 'feedback automat' : 'automated feedback'}</div></div>
        <div className="card card-pad stat-card"><div className="small muted">4–6 weeks</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>{ro ? 'Return' : 'Return'}</div><div className="stat-change">{ro ? 'reminder retenție' : 'retention reminder'}</div></div>
        <div className="card card-pad stat-card"><div className="small muted">VIP</div><div className="stat-value" style={{ fontSize: '1.6rem' }}>{ro ? 'Alertă' : 'Alert'}</div><div className="stat-change">{ro ? 'client inactiv' : 'inactive client'}</div></div>
      </section>
    </div>
  )
}
