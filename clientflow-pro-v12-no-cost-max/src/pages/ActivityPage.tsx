import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getActivity } from '../lib/mockApi'

export function ActivityPage() {
  const { data: activity = [], isLoading } = useQuery({ queryKey: ['activity'], queryFn: getActivity })

  const grouped = useMemo(() => {
    return activity.reduce<Record<string, typeof activity>>((acc, item) => {
      const day = new Date(item.createdAt).toLocaleDateString()
      acc[day] = acc[day] ? [...acc[day], item] : [item]
      return acc
    }, {})
  }, [activity])

  return (
    <div className="grid page-gap-lg">
      <div className="page-header stack-on-mobile">
        <div>
          <p className="eyebrow">Audit trail</p>
          <h1 className="page-title">Activity log</h1>
          <p className="muted">Track changes across clients, tasks, profile settings and workspace tools.</p>
        </div>
        <div className="page-header-actions mobile-full"><div className="pill">🧾 {activity.length} events</div></div>
      </div>

      <div className="card card-pad">
        {isLoading ? <div className="loading-card"><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div> : null}
        {!isLoading && activity.length === 0 ? <div className="empty-state premium-empty-state"><div className="empty-icon">🕘</div><strong>No activity yet.</strong><div className="small muted">Create or update something and it will appear here.</div></div> : null}
        <div className="timeline-list">
          {Object.entries(grouped).map(([day, entries]) => (
            <section key={day}>
              <div className="timeline-day">{day}</div>
              <div className="mobile-card-list compact-card-list">
                {entries.map((entry) => (
                  <article key={entry.id} className="mobile-list-card">
                    <div className="mobile-list-row"><strong>{entry.message}</strong><span className="pill small-pill">{entry.entityType}</span></div>
                    <div className="small muted" style={{ marginTop: 8 }}>{new Date(entry.createdAt).toLocaleTimeString()}</div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
