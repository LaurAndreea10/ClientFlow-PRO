import { Link } from 'react-router-dom'

interface OnboardingModalProps {
  open: boolean
  onClose: () => void
}

const checklist = [
  { title: 'Review the dashboard', description: 'See KPI cards, recent tasks, calendar and reports.' },
  { title: 'Create or import data', description: 'Add clients and tasks manually, then test CSV import/export.' },
  { title: 'Try product-quality flows', description: 'Use search, bulk actions, notifications, reports and Settings.' },
]

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal-card onboarding-modal" role="dialog" aria-modal="true" aria-labelledby="onboarding-title" onClick={(event) => event.stopPropagation()}>
        <div className="card-title-row stack-on-mobile">
          <div>
            <p className="eyebrow">Demo mode</p>
            <h2 id="onboarding-title" style={{ margin: 0 }}>Welcome to ClientFlow Pro</h2>
            <p className="muted" style={{ marginTop: 8 }}>This workspace is preloaded with realistic sample data so recruiters can understand the product in under two minutes.</p>
          </div>
          <div className="pill">✨ Guided start</div>
        </div>

        <div className="grid" style={{ gap: 12, marginTop: 18 }}>
          {checklist.map((item, index) => (
            <article key={item.title} className="mobile-list-card">
              <div className="mobile-list-row">
                <div className="pill small-pill">{index + 1}</div>
                <div>
                  <strong>{item.title}</strong>
                  <div className="small muted">{item.description}</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="toolbar toolbar-stack-mobile wrap-row" style={{ marginTop: 20 }}>
          <Link className="button secondary" to="/settings" onClick={onClose}>Open Settings</Link>
          <Link className="button secondary" to="/reports" onClick={onClose}>Open Reports</Link>
          <button className="button" type="button" onClick={onClose}>Start exploring</button>
        </div>
      </section>
    </div>
  )
}
