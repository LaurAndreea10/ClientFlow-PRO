import { getLanguage, notifyPreferencesChanged, PREFERENCES_KEY, type Language } from '../lib/i18n'
import { useLanguage } from '../lib/i18n'

function writeLanguage(language: Language) {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY)
    const current = raw ? JSON.parse(raw) : {}
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ ...current, language }))
    notifyPreferencesChanged()
  } catch {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ language }))
    notifyPreferencesChanged()
  }
}

export function LanguageSwitch() {
  const { language } = useLanguage()
  const nextLanguage: Language = language === 'RO' ? 'EN' : 'RO'

  return (
    <button
      className="button secondary language-switch"
      type="button"
      onClick={() => writeLanguage(nextLanguage)}
      title={language === 'RO' ? 'Switch to English' : 'Schimbă în română'}
      aria-label={language === 'RO' ? 'Switch to English' : 'Schimbă în română'}
    >
      {getLanguage()} / {nextLanguage}
    </button>
  )
}
