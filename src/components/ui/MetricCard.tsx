type Props = {
  label: string
  value: string | number
}

export function MetricCard({ label, value }: Props) {
  return (
    <div className="card card-pad">
      <div className="muted small">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  )
}