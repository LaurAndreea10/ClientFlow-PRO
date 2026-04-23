export type ThemeMode = 'dark' | 'light'

const THEME_KEY = 'cf_theme'

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(THEME_KEY)
  return stored === 'light' ? 'light' : 'dark'
}

export function setStoredTheme(theme: ThemeMode) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(THEME_KEY, theme)
  document.documentElement.dataset.theme = theme
}

export function applyInitialTheme() {
  if (typeof window === 'undefined') return
  document.documentElement.dataset.theme = getStoredTheme()
}
