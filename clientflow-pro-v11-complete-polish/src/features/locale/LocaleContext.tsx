import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Locale } from '../../types'

const LOCALE_KEY = 'clientflow_locale'

const dictionary = {
  en: {
    navDashboard: 'Dashboard',
    navClients: 'Clients',
    navTasks: 'Tasks',
    navReports: 'Reports',
    navCalendar: 'Calendar',
    navActivity: 'Activity',
    navSettings: 'Settings',
    mobileOptimized: 'Mobile optimized',
    logOut: 'Log out',
    search: 'Search',
    noResults: 'No results found.',
    themeDark: 'Dark',
    themeLight: 'Light',
    language: 'Language',
    installApp: 'Install app',
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    emptyNotifications: 'Everything is quiet for now.',
  },
  ro: {
    navDashboard: 'Tablou',
    navClients: 'Clienți',
    navTasks: 'Taskuri',
    navReports: 'Rapoarte',
    navCalendar: 'Calendar',
    navActivity: 'Activitate',
    navSettings: 'Setări',
    mobileOptimized: 'Optimizat mobil',
    logOut: 'Deconectare',
    search: 'Caută',
    noResults: 'Nu am găsit rezultate.',
    themeDark: 'Întunecat',
    themeLight: 'Luminos',
    language: 'Limbă',
    installApp: 'Instalează aplicația',
    notifications: 'Notificări',
    markAllRead: 'Marchează toate citite',
    emptyNotifications: 'Momentan nu ai notificări.',
  },
} as const

type DictionaryKey = keyof typeof dictionary.en

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: DictionaryKey) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem(LOCALE_KEY)
    return saved === 'ro' ? 'ro' : 'en'
  })

  useEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale: (next) => setLocaleState(next),
    t: (key) => dictionary[locale][key],
  }), [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}
