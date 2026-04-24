# ClientFlow PRO

> Best-of SaaS operations suite — CRM, tasks, reports, calendar, AI Copilot, automation roadmap, demo studio thinking, impact roadmap, backup/restore, bilingual EN/RO interface, PWA support, and GitHub Pages-safe routing.

ClientFlow PRO is a portfolio-ready operational dashboard that merges the strongest ideas from:

- **Alpis Fusion CRM Premium** — AI assistant, premium UX, backup/restore, case-study positioning
- **ClientFlow SaaS CRM Task Manager Automation Suite** — client operations, automations, service templates, invoicing direction, client portal direction
- **ALPIS ImpactPath** — mission, progress and impact storytelling
- **Link Video Editor Studio** — demo readiness, presentation styles, export mindset and product-demo planning

The result is a modern React + TypeScript workspace that works without a paid backend, feels like a real product, and gives recruiters or reviewers an instant, resettable demo.

## 🚀 Live Demo

**→ [Open the live demo](https://laurandreea10.github.io/ClientFlow-PRO/#/login)**

No account needed. Click **"Try Demo"** on the login page to enter the app instantly.

Or sign in with demo credentials:

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `demo@clientflow.pro` |
| Password | `demo1234`            |

All changes in demo mode are saved locally in your browser. Use **Reset demo data** in the sidebar to restore the polished sample workspace. Use **EN / RO** in the topbar to switch language instantly.

---

## Product highlights

- One-click demo mode with seeded CRM data, no signup friction and clear local-storage disclosure
- **Best-of Suite page** that unifies CRM, automations, demo studio, impact roadmap and premium operations thinking
- **AI Copilot** on Dashboard with local recommendations for overdue work, high-value leads, churn risk and revenue forecast
- **Backup / Restore JSON** in Settings for full local workspace export/import
- **Case Study page** inside the app for product story, problem, solution, architecture and future direction
- Bilingual EN/RO interface across core flows, including Login, Layout, Dashboard, Settings, Clients and Tasks
- Language preference persisted locally and applied instantly without refresh
- 6 realistic demo clients with stages, health scores, tags, pinned accounts, custom CRM fields and monthly values
- 10 demo tasks across todo, in-progress and done states, including subtasks, comments, recurrence and priorities
- Resettable demo workspace so reviewers can safely explore destructive actions
- GitHub Pages-safe routing through `HashRouter` for reliable `/#/login`, `/#/dashboard`, `/#/suite` and `/#/case-study` deep links
- React Query cache invalidation for a snappy local-first data layer
- PWA-ready manifest, service worker registration and offline fallback

## What this version includes

- Demo login with one-click access and local session state
- First-run interactive demo tour with guided navigation through Dashboard, Clients, Tasks and Reports
- Toast notification system with success/info states, dismiss actions and undo support
- Dashboard with KPI cards, AI Copilot, workload widgets, revenue target and client status chart
- Advanced Clients workspace with pipeline view, table view, search, filters, pinned accounts, archive/restore and tags
- Client health score, pipeline stages, last-contact tracking and custom CRM fields
- Client detail pages with account controls, linked tasks, custom fields and local notes timeline
- Advanced Tasks workspace with Kanban columns, status changes, archive/restore, saved views and sticky filters
- Undo for client/task archive actions
- Recurring tasks, tags, subtasks with progress, and task comments
- Reports page with analytics charts, CSV export, JSON export and print/PDF-ready output
- Calendar timeline with week/month views, due today, overdue and upcoming widgets
- Activity log with local audit timeline and notification center mock
- Settings page with demo profile, bilingual language preference, backup/restore, theme preference, density, reduced motion, autosave and notifications
- Best-of Suite page with automation flow, product readiness score, demo styles and roadmap modules
- Case Study page with product narrative and technical direction
- Command palette with `Ctrl/Cmd + K` for pages, clients and tasks
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
| AI Copilot | Local recommendations based on clients, task deadlines, lead value and health score |
| Backup | JSON export/import for session, preferences, clients, tasks, notes and saved views |
| Reset | Sidebar action that restores demo clients, tasks and notes |

## Best-of roadmap imported into ClientFlow PRO

| Source project | Strongest idea brought into ClientFlow PRO |
| -------------- | ------------------------------------------ |
| Alpis Fusion CRM Premium | AI assistant, premium UX, backup/restore, case study, product vision |
| ClientFlow SaaS CRM Task Manager Automation Suite | Automation flow, invoicing direction, service templates, time tracking, client portal direction |
| ALPIS ImpactPath | Mission, progress, roadmap and impact framing |
| Link Video Editor Studio | Demo readiness score, style templates, export thinking and demo-story planning |

## Cost model

Required monthly cost: **€0**

- Storage: browser `localStorage`
- Backend: not required
- Paid API: not required
- Hosting: GitHub Pages

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
- Small bilingual copy system through `src/lib/i18n.ts` and page-specific copy through `src/lib/pageCopy.ts`
- Workspace backup utilities through `src/lib/backup.ts`
- React Query for async state management and cache invalidation
- Reusable toast provider for notifications and undo flows
- First-run onboarding/demo tour persisted in localStorage
- Separate premium UI stylesheets for advanced workspace and suite modules
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

Mobile-first bilingual CRM & operations suite built with React, TypeScript, PWA support, AI Copilot, best-of product suite, advanced client pipeline, health score, custom fields, Kanban, recurring tasks, subtasks, comments, analytics, command palette, onboarding tour, backup/restore, resettable demo data and local-first storage.

## Repo topics

`react` `typescript` `vite` `crm` `dashboard` `kanban` `pwa` `portfolio-project` `localstorage` `mobile-first` `ai-copilot` `bilingual` `product-suite`

## Trade-offs

- Kept the app local-first to avoid cost and deployment complexity
- AI Copilot is deterministic and local, not backed by a paid model API
- Invoicing, service templates, client portal and video-demo automation are represented as product-suite direction and roadmap modules, not full production billing/video systems yet
- Client health score, task comments, recurrence and notifications are local mock features, not server-backed collaboration
- PDF export uses the browser print flow instead of a paid document service
- Service worker is intentionally simple and portfolio-friendly

## Future upgrades

- Full invoicing module with duplicate detection and print/PDF layout
- Service templates and time tracking
- Client portal preview with shareable simulated links
- Automation rules with manual run and audit log
- Demo planner with markdown/JSON exports inspired by Link Video Editor Studio
- Impact dashboard for goals, milestones and progress
- Real auth and sync with Supabase free tier
- Multi-user collaboration
- Persistent server-side audit trail
