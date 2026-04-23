import { useEffect, useState } from 'react'
import type { User } from '../../types'
import { getSession } from '../../lib/mockApi'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getSession())
    setLoading(false)

    const handler = () => setUser(getSession())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return { user, loading }
}