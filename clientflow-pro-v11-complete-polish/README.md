# ClientFlow Pro

A mobile-first CRM and workflow dashboard built with **React**, **TypeScript**, and **local-first storage**.

It is designed to look and feel like a real SaaS product while staying **free to run**: no paid backend, no paid API, no hosting bill required to use it locally.

## Live product goals
- manage clients, tasks, notes, reports, and activity in one workspace
- demonstrate product thinking, not only CRUD screens
- stay recruiter-friendly with seeded demo data, onboarding, exports, analytics, and mobile polish

## Core features
- Auth-like local session with seeded demo workspace
- Dashboard, Reports, Calendar, Activity, Settings
- Clients CRUD with search, sort, bulk actions, CSV import, JSON export, undo delete
- Tasks CRUD with list + Kanban drag-and-drop, filters, bulk actions, CSV import, undo delete
- Notes timeline per client
- Notification center + toast feedback
- Activity log / audit trail
- Dark and light theme
- English and Romanian toggle
- PWA-ready manifest and service worker
- Keyboard shortcuts (`/` search, `g` then `d/c/t/r/a/s` navigation)
- Draft autosave for create/edit forms
- Mobile-first layout with bottom navigation

## Cost model
**Current version:** free-first and local-only.
- storage: browser `localStorage`
- backend: not required
- paid API: not required
- monthly cost: **€0 required**

The project is intentionally prepared for a future backend migration, but it does **not** depend on one today.

## Screenshots and presentation assets
The repo includes SVG presentation assets you can use in the README or on GitHub:
- `public/portfolio/cover.svg`
- `public/portfolio/dashboard-preview.svg`
- `public/portfolio/mobile-preview.svg`
- `public/portfolio/reports-preview.svg`

Recommended README image order:
1. cover / hero image
2. dashboard preview
3. mobile preview
4. reports preview

## Architecture
```text
src/
  components/
    layout/
    ui/
  data/
  features/
    auth/
    locale/
    theme/
    toast/
  lib/
    mockApi.ts
    storage.ts
    csv.ts
    uiState.ts
  pages/
    DashboardPage.tsx
    ClientsPage.tsx
    TasksPage.tsx
    ReportsPage.tsx
    CalendarPage.tsx
    ActivityPage.tsx
    SettingsPage.tsx
  routes/
  test/
```

## Product-quality details
- onboarding modal for first-time demo walkthrough
- bulk actions and import/export flows that feel closer to real business software
- empty, loading, and error states
- keyboard-friendly controls and visible focus states
- delete confirmation plus undo feedback for safer actions
- local adapter status in Settings for transparent demo mode

## Getting started
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

## Tests
```bash
npm run test
```

## Typecheck
```bash
npm run typecheck
```

## GitHub Actions
A CI workflow is included in `.github/workflows/ci.yml` and runs:
- install
- typecheck
- tests
- production build

## Suggested GitHub repo description
> Mobile-first CRM & workflow dashboard built with React, TypeScript, PWA support, analytics, drag-and-drop Kanban, import/export, and local-first storage.

## Suggested repo topics
`react` `typescript` `vite` `crm` `dashboard` `kanban` `pwa` `portfolio-project` `localstorage` `mobile-first`

## What I would say in an interview
- I designed the app to behave like a product, not only a UI exercise.
- I used a local-first adapter to avoid cost barriers while keeping the code ready for a future backend.
- I implemented analytics, activity tracking, import/export, bulk actions, and onboarding to make the demo easier to evaluate.
- I optimized the experience for mobile, keyboard access, and recruiter review speed.

## Future upgrades
- Supabase adapter using the free tier
- recurring tasks and reminders
- file attachments
- generated PDF reports
- richer automated UI tests
