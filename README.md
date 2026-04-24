# ClientFlow PRO

> All-in-one SaaS business management dashboard — clients, tasks, reports, calendar, kanban, activity log, command palette, onboarding tour, notifications, and settings.

A mobile-first CRM and workflow dashboard built with React, TypeScript, Vite, and local-first storage.

## 🚀 Live Demo

**→ [Open the live demo](https://laurandreea10.github.io/ClientFlow-PRO/#/login)**

No account needed. Click **"Try Demo"** on the login page to enter the app instantly.

Or sign in with demo credentials:

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `demo@clientflow.pro` |
| Password | `demo1234`            |

All changes in demo mode are saved locally in your browser — refresh freely, nothing leaves your device.

---

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
- Settings page with demo profile, language preference, theme preference, density, reduced motion, autosave and notifications
- Command palette with `Ctrl/Cmd + K` for pages, clients and tasks
- HashRouter GitHub Pages routing for reliable `/#/login` and `/#/dashboard` deep links
- PWA-ready manifest, service worker and offline fallback page
- CI workflow, issue templates, PR template and portfolio assets

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

Mobile-first CRM & workflow dashboard built with React, TypeScript, PWA support, advanced client pipeline, health score, custom fields, Kanban, recurring tasks, subtasks, comments, analytics, command palette, onboarding tour, notifications, undo actions and local-first storage.

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
