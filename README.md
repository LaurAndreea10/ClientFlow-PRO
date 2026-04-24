# ClientFlow PRO

> Complete best-of SaaS operations suite — Command Center, global search, automations, notifications, CRM, tasks, invoices, service templates, time tracking, client portal preview, beauty booking studio, reports, calendar, AI Copilot, demo planner, impact goals, portfolio score, backup/restore, bilingual EN/RO interface, PWA support, and GitHub Pages-safe routing.

ClientFlow PRO is a portfolio-ready operational dashboard that merges the strongest ideas from:

- **Alpis Fusion CRM Premium** — AI assistant, premium UX, backup/restore, case-study positioning
- **ClientFlow SaaS CRM Task Manager Automation Suite** — client operations, automations, service templates, invoicing, time tracking, client portal
- **ALPIS ImpactPath** — mission, progress and impact storytelling
- **Link Video Editor Studio** — demo readiness, presentation styles, export mindset and product-demo planning
- **Beautyus Premium App** — premium service booking, salon calendar, client desk, retention automations and revenue visibility

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

- **Command Center** for priorities, open revenue, bookings, unread notifications and next-best-actions
- **Global Search** across clients, tasks, invoices, services, bookings, demo plans and impact goals
- **Automation Rules** with local run engine for overdue tasks, sent invoices, beauty reminders, VIP retention and high-value leads
- **Notifications Center** with read/unread state and generated automation notifications
- **Portfolio Score** audit page for recruiter-facing demo readiness
- **Public Portal Preview** route such as `/#/portal-preview/BLOOM-2026`
- One-click demo mode with seeded CRM data, no signup friction and clear local-storage disclosure
- **Best-of Suite page** that unifies CRM, automations, demo studio, impact roadmap and premium operations thinking
- **Beauty Studio module** inspired by Beautyus: booking widget, live agenda, client desk, CSV export and retention automation cards
- **AI Copilot** on Dashboard with local recommendations for overdue work, high-value leads, churn risk and revenue forecast
- **Functional Invoicing module** with draft/sent/paid status and print-ready invoice layout
- **Functional Service Templates module** for reusable packages, pricing, duration and deliverables
- **Functional Time Tracking module** with billable estimate
- **Functional Client Portal Preview** with simulated client-facing links and visible sections
- **Functional Demo Planner** with readiness score, style templates, shot list and JSON export
- **Functional Impact Goals** dashboard with progress bars and mission metrics
- **Backup / Restore JSON** in Settings for full local workspace export/import, including suite modules, Beauty Studio bookings, automation rules and notifications
- **Case Study page** inside the app for product story, problem, solution, architecture and future direction
- Bilingual EN/RO interface across core flows
- GitHub Pages-safe routing through `HashRouter` for reliable deep links like `/#/command-center`, `/#/automations`, `/#/notifications`, `/#/suite`, `/#/beauty`, `/#/invoices`, `/#/demo-planner` and `/#/impact`
- React Query cache invalidation for a snappy local-first data layer
- PWA-ready manifest, service worker registration and offline fallback

## What this version includes

- Demo login with one-click access and local session state
- First-run interactive demo tour with guided navigation through Dashboard, Clients, Tasks and Reports
- Toast notification system with success/info states, dismiss actions and undo support
- Command Center page with operational KPIs and next actions
- Global Search page across the full local-first suite
- Automations page with enable/disable state and manual run actions
- Notifications page with generated inbox and read state
- Dashboard with KPI cards, AI Copilot, workload widgets, revenue target and client status chart
- Advanced Clients workspace with pipeline view, table view, search, filters, pinned accounts, archive/restore and tags
- Advanced Tasks workspace with Kanban columns, status changes, archive/restore, saved views and sticky filters
- Invoices page with invoice register, local status changes and printable invoice view
- Services page with reusable service template cards and creation form
- Time page with local time log and billable estimate
- Portal page with simulated client portal previews plus public portal preview route
- Beauty Studio page with service selection, stylist selection, booking form, agenda, retention labels, CSV export and follow-up statuses
- Demo Planner page with URL, style, duration, objective, readiness score, shot list and JSON export
- Impact page with goal progress and mission metrics
- Portfolio Score page with automated readiness audit checklist
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

| Area | Included demo content |
| ---- | --------------------- |
| Clients | Active, lead and inactive accounts with tags, pipeline stages, health scores and custom fields |
| Tasks | Todo, in-progress and done tasks with priorities, due dates, recurrence, subtasks and comments |
| Invoices | Draft, sent and paid invoices with printable layout |
| Services | Reusable service templates with pricing, duration and deliverables |
| Time | Local time entries with billable estimate |
| Portal | Simulated client portal access codes and visible sections |
| Beauty Studio | Bookings, stylists, services, spend, retention labels, agenda statuses and CSV export |
| Automations | Enabled rules for tasks, invoices, bookings, VIP retention and high-value leads |
| Notifications | Generated inbox items with read/unread state |
| Demo Planner | Saved demo plans with readiness score and shot lists |
| Impact | Goals with current/target progress tracking |
| Backup | JSON export/import for core workspace and all suite modules |
| Reset | Sidebar action that restores demo clients, tasks and notes |

## Best-of roadmap imported into ClientFlow PRO

| Source project | Strongest idea brought into ClientFlow PRO |
| -------------- | ------------------------------------------ |
| Alpis Fusion CRM Premium | AI assistant, premium UX, backup/restore, case study, product vision |
| ClientFlow SaaS CRM Task Manager Automation Suite | Automation flow, invoicing, service templates, time tracking, client portal |
| ALPIS ImpactPath | Mission, progress, roadmap and impact framing |
| Link Video Editor Studio | Demo readiness score, style templates, JSON export and demo-story planning |
| Beautyus Premium App | Booking widget, salon agenda, premium service experience, retention automations and revenue visibility |

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

- TypeScript data models for clients, custom fields, tasks, subtasks, comments, recurrence, suite modules, automations and notifications
- Local data adapter through `mockApi.ts`, designed to be replaceable with a real backend later
- Suite module storage through `src/lib/suiteStorage.ts`
- Automation rule engine through `src/lib/automationEngine.ts`
- Unified search helper through `src/lib/globalSearch.ts`
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

Mobile-first bilingual CRM & operations suite built with React, TypeScript, PWA support, Command Center, global search, automation rules, notifications center, AI Copilot, invoicing, service templates, time tracking, client portal preview, beauty booking studio, demo planner, impact goals, portfolio score, best-of product suite, advanced client pipeline, Kanban, analytics, onboarding tour, backup/restore, resettable demo data and local-first storage.

## Repo topics

`react` `typescript` `vite` `crm` `dashboard` `kanban` `pwa` `portfolio-project` `localstorage` `mobile-first` `ai-copilot` `bilingual` `product-suite` `booking-system` `automation`

## Trade-offs

- Kept the app local-first to avoid cost and deployment complexity
- AI Copilot and automations are deterministic and local, not backed by paid APIs
- Client portal links are simulated previews, not public secure links
- Beauty Studio automations are local workflow states, not real SMS/email notifications
- PDF export uses the browser print flow instead of a paid document service
- Service worker is intentionally simple and portfolio-friendly

## Future upgrades

- Real scheduled automation runner with background jobs
- Real public client portal with secure links
- Invoice duplicate detection and branded invoice templates
- Demo planner markdown export and Playwright runner export
- Impact dashboard with milestone timeline
- Beauty Studio SMS/email reminders and room/team capacity planning
- Real auth and sync with Supabase free tier
- Multi-user collaboration
- Persistent server-side audit trail
