import { useLocale } from '../../features/locale/LocaleContext'
import type { NotificationItem } from '../../types'

export function NotificationPanel({
  open,
  items,
  onClose,
  onMarkAllRead,
}: {
  open: boolean
  items: NotificationItem[]
  onClose: () => void
  onMarkAllRead: () => void
}) {
  const { t } = useLocale()
  if (!open) return null

  return (
    <div className="popover-panel" role="dialog" aria-label={t('notifications')}>
      <div className="card-title-row">
        <strong>{t('notifications')}</strong>
        <div className="toolbar compact-toolbar">
          <button className="button secondary" type="button" onClick={onMarkAllRead}>{t('markAllRead')}</button>
          <button className="button secondary" type="button" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="mobile-card-list compact-card-list">
        {items.length ? items.map((item) => (
          <article key={item.id} className="mobile-list-card">
            <div className="mobile-list-row"><strong>{item.title}</strong>{!item.read ? <span className="badge high">new</span> : null}</div>
            <div className="small muted" style={{ marginTop: 8 }}>{item.body}</div>
          </article>
        )) : <div className="empty-state">{t('emptyNotifications')}</div>}
      </div>
    </div>
  )
}
