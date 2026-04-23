import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { uid } from '../../lib/storage'

type ToastType = 'success' | 'info' | 'warning' | 'error'

interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastItem {
  id: string
  title: string
  type: ToastType
  action?: ToastAction
}

interface ToastInput {
  title: string
  type?: ToastType
  action?: ToastAction
}

interface ToastContextValue {
  pushToast: (input: string | ToastInput, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const pushToast = useCallback((input: string | ToastInput, fallbackType: ToastType = 'info') => {
    const normalized = typeof input === 'string'
      ? { title: input, type: fallbackType }
      : { title: input.title, type: input.type ?? fallbackType, action: input.action }

    const item: ToastItem = { id: uid('toast'), title: normalized.title, type: normalized.type, action: normalized.action }
    setItems((current) => [...current, item])
    window.setTimeout(() => {
      setItems((current) => current.filter((toast) => toast.id !== item.id))
    }, item.action ? 5200 : 2600)
  }, [])

  const removeToast = useCallback((id: string) => {
    setItems((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const value = useMemo(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {items.map((item) => (
          <div key={item.id} className={`toast toast-${item.type}`} role="status">
            <span>{item.title}</span>
            {item.action ? (
              <button
                type="button"
                className="toast-action"
                onClick={() => {
                  item.action?.onClick()
                  removeToast(item.id)
                }}
              >
                {item.action.label}
              </button>
            ) : null}
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
