import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { uid } from '../../lib/storage'

type ToastType = 'success' | 'info' | 'warning' | 'error'

interface ToastItem {
  id: string
  title: string
  type: ToastType
}

interface ToastContextValue {
  pushToast: (title: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const pushToast = useCallback((title: string, type: ToastType = 'info') => {
    const item = { id: uid('toast'), title, type }
    setItems((current) => [...current, item])
    window.setTimeout(() => {
      setItems((current) => current.filter((toast) => toast.id !== item.id))
    }, 2600)
  }, [])

  const value = useMemo(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {items.map((item) => (
          <div key={item.id} className={`toast toast-${item.type}`} role="status">
            {item.title}
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
