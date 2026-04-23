export function readDraft<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeDraft<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function clearDraft(key: string) {
  localStorage.removeItem(key)
}

export function hasSeenOnboarding(userId: string) {
  return localStorage.getItem(`clientflow_onboarding_seen_${userId}`) === 'true'
}

export function markOnboardingSeen(userId: string) {
  localStorage.setItem(`clientflow_onboarding_seen_${userId}`, 'true')
}
