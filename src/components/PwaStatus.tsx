import { useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastProvider'

const SYNC_QUEUE_KEY = 'clientflow_sync_queue'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type QueueItem = {
  id: string
  label: string
  createdAt: string
  synced: boolean
}

function readQueue(): QueueItem[] {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeQueue(queue: QueueItem[]) {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
}

function createQueueItem(label: string): QueueItem {
  return {
    id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    createdAt: new Date().toISOString(),
    synced: false,
  }
}

export function PwaStatus() {
  const { pushToast } = useToast()
  const [online, setOnline] = useState(() => navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [queue, setQueue] = useState<QueueItem[]>(() => readQueue())
  const pendingCount = useMemo(() => queue.filter((item) => !item.synced).length, [queue])

  useEffect(() => {
    function handleOnline() {
      setOnline(true)
      const next = readQueue().map((item) => ({ ...item, synced: true }))
      writeQueue(next)
      setQueue(next)
      if (next.length > 0) pushToast({ title: 'Back online', message: 'Local sync queue marked as synced.', tone: 'success' })
    }

    function handleOffline() {
      setOnline(false)
      const next = [createQueueItem('Offline workspace change mock'), ...readQueue()].slice(0, 8)
      writeQueue(next)
      setQueue(next)
      pushToast({ title: 'Offline mode', message: 'Changes stay local and will be queued for mock sync.', tone: 'info' })
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [pushToast])

  async function installApp() {
    if (!installPrompt) {
      pushToast({ title: 'Install unavailable', message: 'Use your browser menu to install this PWA if supported.', tone: 'info' })
      return
    }

    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    setInstallPrompt(null)
    pushToast({
      title: choice.outcome === 'accepted' ? 'Install started' : 'Install dismissed',
      message: 'ClientFlow PRO remains available in the browser.',
      tone: choice.outcome === 'accepted' ? 'success' : 'info',
    })
  }

  function addMockQueueItem() {
    const next = [createQueueItem('Manual local action queued'), ...queue].slice(0, 8)
    writeQueue(next)
    setQueue(next)
    pushToast({ title: 'Queued locally', message: 'Mock sync item added for portfolio demo.', tone: 'success' })
  }

  function clearQueue() {
    writeQueue([])
    setQueue([])
    pushToast({ title: 'Queue cleared', message: 'All mock sync items removed.', tone: 'info' })
  }

  return (
    <div className="pwa-status">
      <button className={`pwa-pill ${online ? 'online' : 'offline'}`} type="button" onClick={addMockQueueItem}>
        <span aria-hidden="true" />
        {online ? 'Online' : 'Offline'} · {pendingCount} queued
      </button>
      <button className="button secondary" type="button" onClick={installApp}>Install</button>
      {queue.length > 0 ? <button className="button secondary" type="button" onClick={clearQueue}>Clear queue</button> : null}
    </div>
  )
}
