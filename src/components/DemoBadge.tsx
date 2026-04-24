import { isDemoSession } from '../auth/demoAuth'

export function DemoBadge() {
  if (!isDemoSession()) return null

  return (
    <div className="pill" title="Demo workspace · changes saved locally">
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: 'var(--accent)',
          display: 'inline-block',
          marginRight: 8,
        }}
      />
      Demo workspace · changes saved locally
    </div>
  )
}
