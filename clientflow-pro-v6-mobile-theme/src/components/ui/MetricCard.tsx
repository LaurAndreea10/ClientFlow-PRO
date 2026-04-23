type Props = {
  label: string
  value: string | number
  hint?: string
}

export function MetricCard({ label, value, hint }: Props) {
  return (
    <div className="card card-pad stat-card">
      <div className="muted small">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-change">● {hint ?? 'Updated from local data'}</div>
    </div>
  )
}
