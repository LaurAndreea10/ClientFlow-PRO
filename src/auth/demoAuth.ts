import type { User } from '../types'
import { uid } from '../lib/storage'

export const DEMO_CREDENTIALS = {
  email: 'demo@clientflow.pro',
  password: 'demo1234',
}

export const AUTH_KEY = 'clientflow_session'

export type DemoSession = User & {
  role?: string
  avatar?: string
  isDemo?: boolean
  loggedInAt?: string
}

export function createDemoSession(): DemoSession {
  return {
    id: 'demo-user',
    fullName: 'Demo User',
    email: DEMO_CREDENTIALS.email,
    role: 'Product Manager',
    avatar: 'DU',
    isDemo: true,
    loggedInAt: new Date().toISOString(),
  }
}

export function loginAsDemo() {
  const session = createDemoSession()
  localStorage.setItem(AUTH_KEY, JSON.stringify(session))
  return session
}

export function login(email: string, password: string) {
  if (
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  ) {
    return loginAsDemo()
  }

  throw new Error('Invalid credentials')
}

export function createLocalSession(email: string, fullName?: string): User {
  return {
    id: uid('user'),
    email,
    fullName: fullName ?? email.split('@')[0].replace(/[._-]/g, ' '),
  }
}

export function getSession(): DemoSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function isDemoSession() {
  return getSession()?.isDemo === true
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}
