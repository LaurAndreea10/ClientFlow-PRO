# ClientFlow PRO

> All-in-one SaaS business management dashboard — clients, tasks, reports, calendar, kanban, activity log, command palette, onboarding tour, notifications, demo reset, bilingual EN/RO interface, PWA support, and settings.

A portfolio-ready CRM and workflow dashboard built with React, TypeScript, Vite, React Query, Recharts, HashRouter routing, bilingual local preferences, and local-first storage.

## 🚀 Live Demo

**→ [Open the live demo](https://laurandreea10.github.io/ClientFlow-PRO/#/login)**

No account needed. Click **"Try Demo"** on the login page to enter the app instantly.

Or sign in with demo credentials:

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `demo@clientflow.pro` |
| Password | `demo1234`            |

All changes in demo mode are saved locally in your browser — refresh freely, nothing leaves your device. Use **Reset demo data** in the sidebar to restore the polished sample workspace at any time. Switch **Language** in Settings to use the app in English or Romanian.

---

## Portfolio highlights

- One-click demo mode with seeded CRM data, no signup friction and clear local-storage disclosure
- Bilingual EN/RO interface for Login, Dashboard, Layout navigation and Settings
- Romanian language preference persisted locally and applied instantly without refresh
- 6 realistic demo clients with stages, health scores, tags, pinned accounts, custom CRM fields and monthly values
- 10 demo tasks across todo, in-progress and done states, including subtasks, comments, recurrence and priorities
- Resettable demo workspace so reviewers can safely explore destructive actions
- GitHub Pages-safe routing through `HashRouter` for reliable `/#/login` and `/#/dashboard` deep links
- React Query cache invalidation for a snappy local-first data layer
- PWA-ready manifest, service worker registration and offline fallback
- Recruiter-friendly README with live link, credentials and clear cost model

## What this version includes

- Demo login with one-click access and local session state
- First-run interactive demo tour with guided navigation through Dashboard, Clients, Tasks and Reports
- Toast notification system with success/info states, dismiss actions and undo support
- Dashboard with KPI cards, workload widgets, revenue target and client status chart
- Advanced Clients workspace with pipeline view, table view, search, filters, pinned accounts, archive/restore and tags
- Client health score, pipeline stages, last-contact tracking and custom CRM fields
- Client detail pages with account controls, linked tasks, custom fields and local notes timeline
- Advanced Tasks workspace with Kanban columns, status changes, archive/restore, saved views and sticky filters
- Undo for client/task archive actions
- Recurring tasks, tags, subtasks with progress, and task comments
- Reports page with analytics charts, CSV export, JSON export and print/PDF-ready output
- Calendar timeline with week/month views, due today, overdue and upcoming widgets
- Activity log with local audit timeline and notification center mock
- Settings page with demo profile, bilingual language preference, theme preference, density, reduced motion, autosave and notifications
- Command palette with `Ctrl/Cmd + K` for pages, clients and tasks
- HashRouter GitHub Pages routing for reliable `/#/login` and `/#/dashboard` deep links
- PWA-ready manifest, service worker and offline fallback page
- CI workflow, issue templates, PR template and portfolio assets

## Demo data model

The demo workspace is intentionally dense enough to make every major page feel alive immediately:

| Area | Included demo content |
| ---- | --------------------- |
| Clients | Active, lead and inactive accounts with tags, pipeline stages, health scores and custom fields |
| Tasks | Todo, in-progress and done tasks with priorities, due dates, recurrence, subtasks and comments |
| Notes | Client timeline notes that make detail pages feel realistic |
| Auth | Local demo session compatible with the existing `User` type |
| Language | English/Romanian preference stored in browser preferences |
| Reset | Sidebar action that restores demo clients, tasks and notes |

## Cost model

Required monthly cost: **€0**

- Storage: browser `localStorage`
- Backend: not required
- Paid API: not required
- Hosting: GitHub Pages

## Screenshots and presentation assets

- `public/portfolio/cover.svg`
- `public/portfolio/dashboard-preview.svg`
- `public/portfolio/mobile-preview.svg`
- `public/portfolio/reports-preview.svg`

## Architecture

```txt
src/
  auth/
  components/
  data/
  features/
  lib/
  pages/
  routes/
  types/
```

## Engineering highlights

- TypeScript data models for clients, custom fields, tasks, subtasks, comments and recurrence
- Local data adapter through `mockApi.ts`, designed to be replaceable with a real backend later
- Route protection with local auth session
- Small bilingual copy system through `src/lib/i18n.ts`
- React Query for async state management and cache invalidation
- Reusable toast provider for notifications and undo flows
- First-run onboarding/demo tour persisted in localStorage
- Separate premium UI stylesheet for advanced workspace components
- GitHub Actions CI for typecheck and production build

## Getting started

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run typecheck
npm run build
```

## Repo description

Mobile-first bilingual CRM & workflow dashboard built with React, TypeScript, PWA support, advanced client pipeline, health score, custom fields, Kanban, recurring tasks, subtasks, comments, analytics, command palette, onboarding tour, notifications, undo actions, resettable demo data and local-first storage.

## Repo topics

`react` `typescript` `vite` `crm` `dashboard` `kanban` `pwa` `portfolio-project` `localstorage` `mobile-first`

## Trade-offs

- Kept the app local-first to avoid cost and deployment complexity
- Client health score, task comments, recurrence and notifications are local mock features, not server-backed collaboration
- Undo is implemented for selected local actions, not as a full global event-sourcing system
- PDF export uses the browser print flow instead of a paid document service
- Service worker is intentionally simple and portfolio-friendly

## Future upgrades that would add external dependencies

- Real auth and sync with Supabase free tier
- Multi-user collaboration
- Real file uploads
- Persistent server-side audit trail
- Server-side recurring task automation
