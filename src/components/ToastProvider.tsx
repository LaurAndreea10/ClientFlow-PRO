import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

type ToastTone = 'success' | 'error' | 'info'

type Toast = {
  id: string
  title: string
  message?: string
  tone: ToastTone
  actionLabel?: string
  onAction?: () => void
}

type ToastInput = Omit<Toast, 'id' | 'tone'> & { tone?: ToastTone }

type ToastContextValue = {
  pushToast: (toast: ToastInput) => void
  pushUndoToast: (title: string, message: string, onUndo: () => void) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

function createId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((toast: ToastInput) => {
    const next: Toast = { ...toast, id: createId(), tone: toast.tone ?? 'info' }
    setToasts((current) => [next, ...current].slice(0, 4))
    window.setTimeout(() => dismiss(next.id), 5200)
  }, [dismiss])

  const pushUndoToast = useCallback((title: string, message: string, onUndo: () => void) => {
    pushToast({
      title,
      message,
      tone: 'info',
      actionLabel: 'Undo',
      onAction: onUndo,
    })
  }, [pushToast])

  const value = useMemo(() => ({ pushToast, pushUndoToast }), [pushToast, pushUndoToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-label="Notifications">
        {toasts.map((toast) => (
          <div className={`toast toast-${toast.tone}`} key={toast.id}>
            <div>
              <strong>{toast.title}</strong>
              {toast.message ? <div className="small muted">{toast.message}</div> : null}
            </div>
            <div className="toast-actions">
              {toast.actionLabel && toast.onAction ? (
                <button
                  className="text-button"
                  type="button"
                  onClick={() => {
                    toast.onAction?.()
                    dismiss(toast.id)
                  }}
                >
                  {toast.actionLabel}
                </button>
              ) : null}
              <button className="icon-button compact" type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">×</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
