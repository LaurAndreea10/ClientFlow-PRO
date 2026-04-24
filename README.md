# ClientFlow PRO

> All-in-one SaaS business management dashboard — clients, tasks, reports, calendar, kanban, and settings.

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

- Dashboard, Clients, Tasks, Reports, Calendar, Activity, Settings
- Clients CRUD with favorites, archive, tags, notes template, duplicate, CSV import/export, bulk actions
- Tasks CRUD with list + Kanban drag-and-drop, recurring tasks, subtasks, mock attachments, archive, duplicate, CSV import/export, bulk actions
- Notes timeline per client
- Search overlay / command style access, keyboard shortcuts, onboarding, toasts, notifications, undo delete
- Reports with printable/PDF-ready export
- Dark and light theme
- English and Romanian toggle
- PWA-ready manifest, service worker and offline fallback page
- CI, issue templates, PR template, portfolio assets

## Cost model

Required monthly cost: **€0**

- Storage: browser `localStorage`
- Backend: not required
- Paid API: not required
- Hosting: optional

## Screenshots and presentation assets

- `public/portfolio/cover.svg`
- `public/portfolio/dashboard-preview.svg`
- `public/portfolio/mobile-preview.svg`
- `public/portfolio/reports-preview.svg`

## Architecture

```txt
src/
  components/
  data/
  features/
  lib/
  pages/
  routes/
```

## Getting started

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run typecheck
npm run test
npm run build
```

## Repo description

Mobile-first CRM & workflow dashboard built with React, TypeScript, PWA support, recurring tasks, Kanban, analytics, import/export, and local-first storage.

## Repo topics

`react` `typescript` `vite` `crm` `dashboard` `kanban` `pwa` `portfolio-project` `localstorage` `mobile-first`

## Trade-offs

- Kept the app local-first to avoid cost and deployment complexity
- Mock attachments stay metadata-only, not real cloud uploads
- PDF export uses the browser print flow instead of a paid document service
- Service worker is intentionally simple and portfolio-friendly

## Future upgrades that would add external dependencies

- Real auth and sync with Supabase free tier
- Multi-user collaboration
- Real file uploads
- Persistent server-side audit trail
