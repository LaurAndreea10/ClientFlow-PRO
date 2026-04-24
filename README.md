# ClientFlow PRO

![CI](https://github.com/LaurAndreea10/ClientFlow-PRO/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-PWA-646CFF?logo=vite&logoColor=white)
![Local first](https://img.shields.io/badge/storage-localStorage-22C55E)

> Multi-industry CRM and operations suite with public landing, guided demo, role-based access, automations, bookings, invoices, local-first storage and Supabase-ready architecture.

## Recruiter quick review

- **Live demo:** [laurandreea10.github.io/ClientFlow-PRO](https://laurandreea10.github.io/ClientFlow-PRO/#/)
- **Demo login:** `demo@clientflow.pro` / `demo1234`
- **Best route:** Start Here → Command Center → Automations → Portfolio Score
- **Tech:** React, TypeScript, Vite, React Query
- **Status:** portfolio demo, local-first, Supabase-ready

> **Demo note:** data is stored in your browser with `localStorage`. Access links and portal links are simulated for portfolio review; production security would use backend auth and Supabase Row Level Security.

## 🚀 Live Demo

**→ [Open the landing page](https://laurandreea10.github.io/ClientFlow-PRO/#/)**  
**→ [Open the login demo](https://laurandreea10.github.io/ClientFlow-PRO/#/login)**  
**→ [Start the guided demo](https://laurandreea10.github.io/ClientFlow-PRO/#/start-here)**

### Demo credentials

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `demo@clientflow.pro` |
| Password | `demo1234`            |

No account needed. Click **Try Demo** on the landing or login page to enter instantly. All changes are saved locally in your browser.

---

## Portfolio preview

![Landing page preview](docs/assets/landing.svg)

| Command Center | Workspace Access |
| -------------- | ---------------- |
| ![Command Center](docs/assets/command-center.svg) | ![Workspace Access](docs/assets/workspace-access.svg) |

| Industry CRM | Automations |
| ------------ | ----------- |
| ![Industry CRM](docs/assets/industry-crm.svg) | ![Automations](docs/assets/automations.svg) |

![Portfolio Score](docs/assets/portfolio-score.svg)

---

## Product docs

- [Demo Script](docs/DEMO_SCRIPT.md)
- [Manual Test Flow](docs/MANUAL_TEST_FLOW.md)
- [Product Case Study](docs/PRODUCT_CASE_STUDY.md)
- [Supabase-ready Architecture](docs/SUPABASE_READY.md)

## Why this project stands out

ClientFlow PRO brings together CRM, tasks, invoices, bookings, automations, role-based access and industry-specific setup in one free portfolio demo. It is local-first for easy testing, but documented for a future Supabase migration.

## Product highlights

- Public landing page with product explanation, industries, roles, demo credentials and CTA buttons
- Guided `Start Here` flow and in-app `Demo Script`
- Workspace onboarding with industry-specific CRM setup
- Templates and seed data for Beauty, Mecanic auto, Kinetoterapeut, Psiholog and Custom CRM
- Permission-aware UI for Admin, Angajat and Angajat nou roles
- Admin invite links for team access
- Command Center, Global Search, Automations and Notifications
- CRM, Tasks, Invoices, Services, Time Tracking and Beauty Studio
- Client Portal Preview and public portal preview route
- Portfolio Score, Case Study and Supabase-ready architecture docs
- Backup / Restore JSON for the local workspace
- Bilingual EN/RO interface, PWA support and GitHub Pages-safe routing

## Recommended demo flow

1. `/#/` → open the public landing page
2. `/#/login` → click **Try Demo**
3. `/#/start-here` → follow the guided demo path
4. `/#/demo-script` → show the 60-second pitch and route plan
5. `/#/command-center` → show operational overview
6. `/#/workspace-setup` → show industry setup, roles and invite links
7. `/#/clients` or `/#/tasks` → show permission-aware UI and industry labels
8. `/#/automations` → run rules and generate notifications
9. `/#/portfolio-score` → close with readiness score

## Workspace and access roles

| Role | Access |
| ---- | ------ |
| Admin | Full access: add, edit, delete, manage permissions and restore backups |
| Angajat | View, add and validate/update client status |
| Angajat nou | View only; Add/Edit/Delete/status actions are disabled |

## Industry CRM templates

| Industry | CRM focus | Seed examples |
| -------- | --------- | ------------- |
| Beauty / Salon | Programări, servicii, stiliști, retenție VIP | VIP balayage client, nails returning client, reminder tasks |
| Mecanic auto | Fișă mașină, diagnoză, deviz, reparație, predare | VW Golf 7, BMW X3, deviz, fișă mașină |
| Kinetoterapeut | Diagnostic, plan tratament, ședințe, progres | Recuperare genunchi, durere lombară, reevaluare |
| Psiholog | Intake, consimțământ, tip ședință, confidențialitate | Client intake, consimțământ, follow-up terapeutic |
| Personalizat | Câmpuri, statusuri și etichete CRM configurabile | Client custom și task de configurare flux |

## Included modules

- Landing page and one-click demo mode
- Start Here and Demo Script pages
- Workspace Access, roles and invite links
- Command Center and Global Search
- CRM, Tasks, Services, Invoices and Time Tracking
- Client Portal Preview and public portal preview route
- Beauty Studio booking and retention module
- Automations and Notifications
- Reports, Calendar and Activity Log
- Demo Planner and Impact Goals
- Portfolio Score and Case Study
- Backup / Restore JSON
- Supabase-ready architecture documentation

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

## Cost model

Required monthly cost: **€0**

- Storage: browser `localStorage`
- Backend: not required for the portfolio demo
- Paid API: not required
- Hosting: GitHub Pages

## Engineering highlights

- TypeScript domain models for CRM, tasks, workspace access, automations and suite modules
- Local data adapter through `mockApi.ts`, designed to be replaceable with a backend
- Permission and industry seed model through `src/lib/workspaceAccess.ts`
- Automation rule engine through `src/lib/automationEngine.ts`
- Unified search helper through `src/lib/globalSearch.ts`
- Supabase migration plan through `docs/SUPABASE_READY.md`
- React Query for async state management and cache invalidation
- GitHub Actions CI for typecheck and production build

## Quality checks

```bash
npm run typecheck
npm run build
```

## Trade-offs

- Local-first storage keeps the demo free and easy to reset, but there is no real multi-device sync yet.
- Access links and permissions are UI/workflow simulations; production enforcement should use backend auth and RLS.
- AI Copilot and automations are deterministic and local, not backed by paid APIs.
- Client portal links are simulated previews, not secure public links.
