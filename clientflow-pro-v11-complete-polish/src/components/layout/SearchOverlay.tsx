import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { Client, Task } from '../../types'
import { useLocale } from '../../features/locale/LocaleContext'

export function SearchOverlay({
  open,
  query,
  onClose,
  onQueryChange,
  clients,
  tasks,
}: {
  open: boolean
  query: string
  onClose: () => void
  onQueryChange: (value: string) => void
  clients: Client[]
  tasks: Task[]
}) {
  const { t } = useLocale()
  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return [] as Array<{ id: string; label: string; path: string; meta: string }>
    const clientResults = clients
      .filter((client) => `${client.name} ${client.company} ${client.email}`.toLowerCase().includes(term))
      .map((client) => ({ id: client.id, label: client.name, path: `/clients/${client.id}`, meta: client.company }))
    const taskResults = tasks
      .filter((task) => `${task.title} ${task.description}`.toLowerCase().includes(term))
      .map((task) => ({ id: task.id, label: task.title, path: '/tasks', meta: task.status.replace('_', ' ') }))
    return [...clientResults, ...taskResults].slice(0, 10)
  }, [clients, tasks, query])

  if (!open) return null

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-card" onClick={(event) => event.stopPropagation()}>
        <div className="card-title-row">
          <h3 style={{ margin: 0 }}>{t('search')}</h3>
          <button className="button secondary" onClick={onClose} type="button">Esc</button>
        </div>
        <input
          autoFocus
          className="input"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={`${t('search')} clients and tasks...`}
          aria-label={t('search')}
        />
        <div className="mobile-card-list" style={{ marginTop: 14 }}>
          {results.length ? results.map((result) => (
            <Link key={result.id + result.path} className="mobile-list-card" to={result.path} onClick={onClose}>
              <div className="mobile-list-row"><strong>{result.label}</strong><span className="small muted">{result.meta}</span></div>
            </Link>
          )) : <div className="empty-state premium-empty-state">{t('noResults')}</div>}
        </div>
      </div>
    </div>
  )
}
