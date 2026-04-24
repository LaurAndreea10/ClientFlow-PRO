import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGlobalSearchResults, type GlobalSearchResult } from '../lib/globalSearch'
import { useLanguage } from '../lib/i18n'

export function SearchPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GlobalSearchResult[]>([])

  useEffect(() => {
    getGlobalSearchResults(query).then(setResults)
  }, [query])

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">{ro ? 'Căutare globală' : 'Global search'}</p>
          <h1 className="page-title">{ro ? 'Caută în toată suita' : 'Search across the whole suite'}</h1>
          <p className="muted">{ro ? 'Clienți, task-uri, facturi, servicii, bookings, demo plans și obiective.' : 'Clients, tasks, invoices, services, bookings, demo plans and goals.'}</p>
        </div>
      </div>

      <section className="card card-pad">
        <input className="input" autoFocus placeholder={ro ? 'Caută orice...' : 'Search anything...'} value={query} onChange={(event) => setQuery(event.target.value)} />
      </section>

      <section className="card card-pad">
        <div className="list">
          {results.map((result) => (
            <Link className="note" to={result.href} key={`${result.type}-${result.id}`}>
              <div className="card-title-row">
                <div>
                  <strong>{result.title}</strong>
                  <div className="small muted">{result.description}</div>
                </div>
                <span className="badge active">{result.type}</span>
              </div>
            </Link>
          ))}
          {results.length === 0 ? <div className="empty-state">{ro ? 'Niciun rezultat.' : 'No results.'}</div> : null}
        </div>
      </section>
    </div>
  )
}
