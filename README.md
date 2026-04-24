# ClientFlow PRO

> Complete best-of SaaS operations suite — public landing page, Start Here demo flow, workspace onboarding, industry-specific CRM configuration, domain-specific seed data, real rule-based UI permissions, team access roles, invite links, Command Center, global search, automations, notifications, CRM, tasks, invoices, service templates, time tracking, client portal preview, beauty booking studio, reports, calendar, AI Copilot, demo planner, impact goals, portfolio score, backup/restore, bilingual EN/RO interface, Supabase-ready architecture, PWA support, and GitHub Pages-safe routing.

ClientFlow PRO is a portfolio-ready operational dashboard that merges the strongest ideas from:

- **Alpis Fusion CRM Premium** — AI assistant, premium UX, backup/restore, case-study positioning
- **ClientFlow SaaS CRM Task Manager Automation Suite** — client operations, automations, service templates, invoicing, time tracking, client portal
- **ALPIS ImpactPath** — mission, progress and impact storytelling
- **Link Video Editor Studio** — demo readiness, presentation styles, export mindset and product-demo planning
- **Beautyus Premium App** — premium service booking, salon calendar, client desk, retention automations and revenue visibility

The result is a modern React + TypeScript workspace that works without a paid backend, feels like a real product, and gives recruiters or reviewers an instant, resettable demo.

## 🚀 Live Demo

**→ [Open the landing page](https://laurandreea10.github.io/ClientFlow-PRO/#/)**

**→ [Open the login demo](https://laurandreea10.github.io/ClientFlow-PRO/#/login)**

No account needed. Click **"Try Demo"** on the landing or login page to enter the app instantly.

Or sign in with demo credentials:

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `demo@clientflow.pro` |
| Password | `demo1234`            |

All changes in demo mode are saved locally in your browser. Use **Reset demo data** in the sidebar to restore the polished sample workspace. Use **EN / RO** in the topbar to switch language instantly.

---

## Product highlights

- **Public landing page** at `/#/` and `/#/landing` with product explanation, industries, roles, demo credentials and CTA buttons
- **Start Here** recruiter flow at `/#/start-here` with the recommended 6-step product demo
- **Workspace onboarding** from account creation with industry-specific CRM setup
- **Industry templates** for Beauty, Mecanic auto, Kinetoterapeut, Psiholog and Custom CRM
- **Domain-specific demo seed**: Auto, Kineto, Psychology, Beauty and Custom generate relevant clients/tasks at workspace creation
- **Industry-aware CRM UI** in Clients, Tasks, Invoices, Services, Time Tracking, Portal, Impact and Beauty Studio
- **Real rule-based UI permissions**: unsupported Add/Edit/Delete/Status/Run/Restore actions are disabled by role
- **Team access management** with Admin, Angajat and Angajat nou roles
- **Permission matrix** for view, add, edit, delete, manage permissions, validate client status and full access
- **Admin invite links**: admin can create employee access and copy/send a ClientFlow PRO link
- **Supabase-ready architecture note** in `docs/SUPABASE_READY.md`
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
- **Functional Invoicing module** with role-aware status actions and print-ready invoice layout
- **Functional Service Templates module** for reusable packages, pricing, duration and deliverables
- **Functional Time Tracking module** with billable estimate
- **Functional Client Portal Preview** with simulated client-facing links and visible sections
- **Functional Demo Planner** with readiness score, style templates, shot list and JSON export
- **Functional Impact Goals** dashboard with progress bars and mission metrics
- **Backup / Restore JSON** in Settings for full local workspace export/import, including suite modules, workspace configuration, roles, access links, Beauty Studio bookings, automation rules and notifications
- **Case Study page** inside the app for product story, problem, solution, architecture and future direction
- Bilingual EN/RO interface across core flows
- GitHub Pages-safe routing through `HashRouter` for reliable deep links like `/#/`, `/#/start-here`, `/#/workspace-setup`, `/#/command-center`, `/#/automations`, `/#/notifications`, `/#/suite`, `/#/beauty`, `/#/invoices`, `/#/demo-planner` and `/#/impact`
- React Query cache invalidation for a snappy local-first data layer
- PWA-ready manifest, service worker registration and offline fallback

## Recommended demo flow

1. `/#/` → open the public landing page
2. `/#/login` → click **Try Demo**
3. `/#/start-here` → follow the guided demo path
4. `/#/command-center` → show operational overview
5. `/#/workspace-setup` → show industry setup, roles and invite links
6. `/#/clients` or `/#/tasks` → show permission-aware UI and industry labels
7. `/#/automations` → run rules and generate notifications
8. `/#/portfolio-score` → close with readiness score

## Workspace and access roles

| Role | Access |
| ---- | ------ |
| Admin | Editează, modifică, șterge, adaugă permisiuni, gestionează accesul și are acces total |
| Angajat | Vizualizează, adaugă și validează status client |
| Angajat nou | View only; Add/Edit/Delete/status actions are disabled in the UI |

Adminul poate crea un profil de acces cu nume, email, rol și permisiuni custom, apoi poate copia linkul `/#/accept-access/:accessId` pentru angajat.

## Industry CRM templates

| Industry | CRM focus | Seed examples |
| -------- | --------- | ------------- |
| Beauty / Salon | Programări, servicii, stiliști, retenție VIP | VIP balayage client, nails returning client, reminder tasks |
| Mecanic auto | Fișă mașină, diagnoză, deviz, reparație, predare | VW Golf 7, BMW X3, deviz, fișă mașină |
| Kinetoterapeut | Diagnostic, plan tratament, ședințe, progres | Recuperare genunchi, durere lombară, reevaluare |
| Psiholog | Intake, consimțământ, tip ședință, confidențialitate | Client intake, consimțământ, follow-up terapeutic |
| Personalizat | Câmpuri, statusuri și etichete CRM configurabile | Client custom și task de configurare flux |

## What this version includes

- Demo login with one-click access and local session state
- Account creation with domain-specific workspace setup
- Domain-specific seed data generated on workspace creation
- Workspace Access page with CRM profile editing, custom fields, custom statuses and team invitations
- Accept Access route for invite links
- Public landing page before login
- Start Here page with recruiter-focused demo flow
- Permission-aware Clients, Tasks, Invoices, Services, Time Tracking, Portal, Automations, Demo Planner, Impact Goals, Settings and Beauty Studio pages
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
- Settings page with demo profile, bilingual language preference, role-aware backup/restore, theme preference, density, reduced motion, autosave and notifications
- Best-of Suite page with automation flow, product readiness score, demo styles and roadmap modules
- Case Study page with product narrative and technical direction
- Supabase-ready architecture note with suggested tables, RLS sketch and migration path
- Command palette with `Ctrl/Cmd + K` for pages, clients and tasks
- PWA-ready manifest, service worker and offline fallback page
- CI workflow, issue templates, PR template and portfolio assets

## Demo data model

| Area | Included demo content |
| ---- | --------------------- |
| Workspace | Industry template, custom CRM labels, statuses, fields and team access profiles |
| Domain seed | Auto/Kineto/Psychology/Beauty/Custom-specific clients and tasks |
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

## Cost model

Required monthly cost: **€0**

- Storage: browser `localStorage`
- Backend: not required
- Paid API: not required
- Hosting: GitHub Pages

## Engineering highlights

- TypeScript data models for clients, custom fields, tasks, subtasks, comments, recurrence, suite modules, automations, notifications, workspace profiles and team access roles
- Local data adapter through `mockApi.ts`, designed to be replaceable with a real backend later
- Workspace access, permission and industry seed model through `src/lib/workspaceAccess.ts`
- Suite module storage through `src/lib/suiteStorage.ts`
- Automation rule engine through `src/lib/automationEngine.ts`
- Unified search helper through `src/lib/globalSearch.ts`
- Supabase migration plan through `docs/SUPABASE_READY.md`
- Route protection with local auth session
- Small bilingual copy system through `src/lib/i18n.ts` and page-specific copy through `src/lib/pageCopy.ts`
- Workspace backup utilities through `src/lib/backup.ts`
- React Query for async state management and cache invalidation
- Reusable toast provider for notifications and undo flows
- First-run onboarding/demo tour persisted in localStorage
- Separate premium UI stylesheets for advanced workspace and suite modules
- GitHub Actions CI for typecheck and production build

## Quality checks

```bash
npm run typecheck
npm run build
```

## Trade-offs

- Kept the app local-first to avoid cost and deployment complexity
- Access links and permissions are local simulations, not secure production auth yet
- AI Copilot and automations are deterministic and local, not backed by paid APIs
- Client portal links are simulated previews, not public secure links
- Beauty Studio automations are local workflow states, not real SMS/email notifications
- PDF export uses the browser print flow instead of a paid document service
