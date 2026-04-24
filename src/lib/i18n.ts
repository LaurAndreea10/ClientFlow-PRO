import { useEffect, useState } from 'react'

export const PREFERENCES_KEY = 'clientflow_preferences'
export const PREFERENCES_CHANGED_EVENT = 'clientflow:preferences-changed'

export type Language = 'EN' | 'RO'

export function getLanguage(): Language {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed?.language === 'RO' ? 'RO' : 'EN'
  } catch {
    return 'EN'
  }
}

export function notifyPreferencesChanged() {
  window.dispatchEvent(new Event(PREFERENCES_CHANGED_EVENT))
}

export const translations = {
  EN: {
    layout: {
      workspace: 'ClientFlow / Workspace',
      productIntro: 'SaaS-style CRM starter with local-first storage, analytics, calendar, activity log and settings.',
      commandCenter: 'Command center',
      portfolioPolish: 'Portfolio UX polish',
      freeFirstMode: 'Free-first mode',
      noBackendBill: 'No backend bill required',
      localBuild: 'The current build stores demo auth, clients, tasks and notes directly in the browser.',
      resetDemo: 'Reset demo data',
      resettingDemo: 'Resetting demo...',
      logout: 'Log out',
      quickAdd: 'Quick add',
      titles: {
        '/dashboard': 'Portfolio dashboard',
        '/clients': 'Client relationships',
        '/tasks': 'Delivery workflow',
        '/reports': 'Reports and analytics',
        '/calendar': 'Calendar timeline',
        '/activity': 'Activity log',
        '/settings': 'Workspace settings',
      },
      links: {
        dashboard: 'Dashboard',
        clients: 'Clients',
        tasks: 'Tasks',
        reports: 'Reports',
        calendar: 'Calendar',
        activity: 'Activity',
        settings: 'Settings',
      },
      shortcuts: [
        { label: '⌘K Search', hint: 'Command palette' },
        { label: 'Quick add', hint: 'Create task flow' },
        { label: 'Reports', hint: 'Export CSV / JSON' },
      ],
    },
    login: {
      eyebrow: 'Portfolio-ready app',
      title: 'Manage clients like a real product.',
      description: 'This version is optimized for GitHub portfolio use: polished dashboard, realistic CRM flows, and no mandatory external services.',
      features: [
        ['Local-first data', 'Everything works in the browser, so there are no required monthly costs.'],
        ['Real app structure', 'Routing, auth gate, CRUD flows, notes, charts and dashboard states.'],
        ['Easy upgrade path', 'You can later replace mock storage with Supabase or another free backend.'],
      ],
      welcome: 'Welcome back',
      signIn: 'Sign in',
      noAccountNeeded: 'No account needed — try the demo workspace.',
      demoMode: 'Demo Mode',
      demoDescription: 'Explore clients, tasks, reports, calendar, kanban and settings. Changes are saved locally in this browser.',
      noSignup: 'No signup',
      tryDemo: 'Try Demo →',
      demoCredentials: 'Or use demo credentials:',
      autofill: 'Autofill',
      email: 'Email',
      password: 'Password',
      signingIn: 'Signing in...',
      noAccount: 'No account yet?',
      createOne: 'Create one',
      demoError: 'Could not start demo mode',
      credentialsError: 'Invalid credentials',
    },
    dashboard: {
      eyebrow: 'Main workspace',
      title: 'Run your client pipeline from one dashboard.',
      description: 'This project is intentionally portfolio-friendly: realistic data model, clean UI, local persistence and a structure that can later connect to a real API.',
      revenueTarget: 'Revenue target',
      responseTime: 'Response time',
      storageMode: 'Storage mode',
      local: 'Local',
      totalClients: 'Total clients',
      activeTasks: 'Active tasks',
      completedTasks: 'Completed tasks',
      monthlyRevenue: 'Monthly revenue',
      seededInstantly: 'Seeded instantly',
      openWorkload: 'Open workload',
      trackedLocally: 'Tracked locally',
      fromRetainers: 'From client retainers',
      clientStatusMix: 'Client status mix',
      statusHint: 'Quick overview for lead quality and account health.',
      demoChart: 'Demo chart',
      recentTasks: 'Recent tasks',
      recentTasksHint: 'Latest delivery items from your local workspace.',
      due: 'Due',
      noDeadline: 'No deadline',
      emptyTasks: 'No tasks available yet.',
      statuses: { Lead: 'Lead', Active: 'Active', Inactive: 'Inactive' },
    },
    settings: {
      eyebrow: 'Workspace setup',
      title: 'Settings',
      description: 'Local user preferences, accessibility controls and demo profile details.',
      autosaved: 'Autosaved',
      localPreferences: 'Local preferences',
      profile: 'Profile',
      profileHint: 'Demo account details visible to recruiters.',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      preferences: 'Preferences',
      preferencesHint: 'Persisted locally in this browser.',
      language: 'Language',
      theme: 'Theme',
      density: 'Density',
      system: 'System',
      dark: 'Dark',
      light: 'Light',
      comfortable: 'Comfortable',
      compact: 'Compact',
      accessibility: 'Accessibility and workflow',
      accessibilityHint: 'Settings that show product thinking beyond CRUD.',
      reducedMotion: 'Reduced motion',
      reducedMotionHint: 'Minimize decorative motion for accessibility.',
      draftAutosave: 'Draft autosave',
      draftAutosaveHint: 'Keep unfinished forms safe in local storage.',
      notifications: 'Notifications',
      notificationsHint: 'Show local reminders and workspace alerts.',
    },
  },
  RO: {
    layout: {
      workspace: 'ClientFlow / Spațiu de lucru',
      productIntro: 'Starter CRM de tip SaaS cu stocare local-first, analytics, calendar, jurnal de activitate și setări.',
      commandCenter: 'Centru de comandă',
      portfolioPolish: 'UX polish pentru portofoliu',
      freeFirstMode: 'Mod free-first',
      noBackendBill: 'Fără costuri de backend',
      localBuild: 'Versiunea curentă salvează autentificarea demo, clienții, task-urile și notițele direct în browser.',
      resetDemo: 'Resetează datele demo',
      resettingDemo: 'Se resetează demo-ul...',
      logout: 'Deconectare',
      quickAdd: 'Adaugă rapid',
      titles: {
        '/dashboard': 'Dashboard de portofoliu',
        '/clients': 'Relații cu clienții',
        '/tasks': 'Flux de livrare',
        '/reports': 'Rapoarte și analytics',
        '/calendar': 'Calendar',
        '/activity': 'Jurnal de activitate',
        '/settings': 'Setări workspace',
      },
      links: {
        dashboard: 'Dashboard',
        clients: 'Clienți',
        tasks: 'Task-uri',
        reports: 'Rapoarte',
        calendar: 'Calendar',
        activity: 'Activitate',
        settings: 'Setări',
      },
      shortcuts: [
        { label: '⌘K Căutare', hint: 'Paletă de comenzi' },
        { label: 'Adaugă rapid', hint: 'Flux de creare task' },
        { label: 'Rapoarte', hint: 'Export CSV / JSON' },
      ],
    },
    login: {
      eyebrow: 'Aplicație gata de portofoliu',
      title: 'Gestionează clienții ca într-un produs real.',
      description: 'Această versiune este optimizată pentru GitHub portfolio: dashboard polished, fluxuri CRM realiste și fără servicii externe obligatorii.',
      features: [
        ['Date local-first', 'Totul funcționează în browser, deci nu există costuri lunare obligatorii.'],
        ['Structură reală de aplicație', 'Routing, auth gate, fluxuri CRUD, notițe, grafice și stări de dashboard.'],
        ['Ușor de extins', 'Mai târziu poți înlocui mock storage cu Supabase sau alt backend gratuit.'],
      ],
      welcome: 'Bine ai revenit',
      signIn: 'Autentificare',
      noAccountNeeded: 'Nu ai nevoie de cont — încearcă workspace-ul demo.',
      demoMode: 'Mod Demo',
      demoDescription: 'Explorează clienți, task-uri, rapoarte, calendar, kanban și setări. Modificările sunt salvate local în acest browser.',
      noSignup: 'Fără cont',
      tryDemo: 'Încearcă demo →',
      demoCredentials: 'Sau folosește datele demo:',
      autofill: 'Completează automat',
      email: 'Email',
      password: 'Parolă',
      signingIn: 'Se autentifică...',
      noAccount: 'Nu ai cont?',
      createOne: 'Creează unul',
      demoError: 'Nu s-a putut porni modul demo',
      credentialsError: 'Date de autentificare invalide',
    },
    dashboard: {
      eyebrow: 'Workspace principal',
      title: 'Controlează pipeline-ul de clienți dintr-un singur dashboard.',
      description: 'Proiectul este gândit pentru portofoliu: model de date realist, UI curat, persistență locală și structură pregătită pentru conectare la un API real.',
      revenueTarget: 'Țintă venituri',
      responseTime: 'Timp răspuns',
      storageMode: 'Mod stocare',
      local: 'Local',
      totalClients: 'Total clienți',
      activeTasks: 'Task-uri active',
      completedTasks: 'Task-uri finalizate',
      monthlyRevenue: 'Venit lunar',
      seededInstantly: 'Seed instant',
      openWorkload: 'Volum deschis',
      trackedLocally: 'Urmărit local',
      fromRetainers: 'Din abonamente clienți',
      clientStatusMix: 'Distribuție status clienți',
      statusHint: 'Privire rapidă asupra calității lead-urilor și sănătății conturilor.',
      demoChart: 'Grafic demo',
      recentTasks: 'Task-uri recente',
      recentTasksHint: 'Cele mai noi livrabile din workspace-ul local.',
      due: 'Termen',
      noDeadline: 'Fără termen',
      emptyTasks: 'Nu există task-uri încă.',
      statuses: { Lead: 'Lead', Active: 'Activ', Inactive: 'Inactiv' },
    },
    settings: {
      eyebrow: 'Configurare workspace',
      title: 'Setări',
      description: 'Preferințe locale, controale de accesibilitate și detalii profil demo.',
      autosaved: 'Salvat automat',
      localPreferences: 'Preferințe locale',
      profile: 'Profil',
      profileHint: 'Detalii cont demo vizibile pentru recruiteri.',
      name: 'Nume',
      email: 'Email',
      role: 'Rol',
      preferences: 'Preferințe',
      preferencesHint: 'Salvate local în acest browser.',
      language: 'Limbă',
      theme: 'Temă',
      density: 'Densitate',
      system: 'Sistem',
      dark: 'Întunecată',
      light: 'Luminoasă',
      comfortable: 'Confortabilă',
      compact: 'Compactă',
      accessibility: 'Accesibilitate și workflow',
      accessibilityHint: 'Setări care arată gândire de produs dincolo de CRUD.',
      reducedMotion: 'Mișcare redusă',
      reducedMotionHint: 'Reduce animațiile decorative pentru accesibilitate.',
      draftAutosave: 'Autosave draft',
      draftAutosaveHint: 'Păstrează formularele neterminate în local storage.',
      notifications: 'Notificări',
      notificationsHint: 'Afișează remindere locale și alerte de workspace.',
    },
  },
} as const

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => getLanguage())

  useEffect(() => {
    const syncLanguage = () => setLanguage(getLanguage())

    window.addEventListener('storage', syncLanguage)
    window.addEventListener(PREFERENCES_CHANGED_EVENT, syncLanguage)
    return () => {
      window.removeEventListener('storage', syncLanguage)
      window.removeEventListener(PREFERENCES_CHANGED_EVENT, syncLanguage)
    }
  }, [])

  return {
    language,
    copy: translations[language],
  }
}
