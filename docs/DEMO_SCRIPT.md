# ClientFlow PRO — Demo Script

Use this script for a fast recruiter or portfolio walkthrough.

## 60-second pitch

ClientFlow PRO is an industry-configurable CRM and operations suite. The admin creates a workspace, chooses the industry, customizes CRM labels and statuses, then invites employees with role-based access. The app includes CRM, tasks, invoices, booking, automations, notifications, public portal preview, backup/restore and a Supabase-ready architecture. This portfolio version is local-first so the live demo stays free, fast and easy to test.

## Recommended live route order

| Time | Route | What to show | Talking point |
| ---- | ----- | ------------ | ------------- |
| 00:00 | `/#/` | Public landing page | Explain what ClientFlow PRO is and show supported industries. |
| 00:10 | `/#/login` | Try Demo | No signup friction; demo credentials are visible. |
| 00:15 | `/#/start-here` | Guided demo route | The app tells reviewers where to look first. |
| 00:25 | `/#/command-center` | Operational overview | Priorities, open revenue, bookings, notifications and next actions. |
| 00:35 | `/#/workspace-setup` | Industry and roles | Admin configures domain-specific CRM and creates access links. |
| 00:45 | `/#/clients` | Industry-aware CRM | Labels, status pipeline and fields adapt to Beauty, Auto, Kineto, Psychology or Custom. |
| 00:52 | `/#/automations` | Run rules | Local rules generate notifications from overdue tasks, sent invoices, bookings and high-value leads. |
| 01:00 | `/#/portfolio-score` | Readiness checklist | Close by showing that the demo is complete and recruiter-friendly. |

## Features to highlight

- Public landing page before login
- One-click demo mode
- Workspace onboarding by industry
- Domain-specific seed data
- Role-based UI permissions
- Admin-generated access links
- Command Center
- Global Search
- Automations + Notifications
- Client portal preview
- Backup / Restore
- Supabase-ready architecture document

## Likely recruiter questions

### Where is the backend?

This portfolio version is intentionally local-first. It avoids paid services and keeps the live demo fast and easy to reset. The backend migration plan is documented in `docs/SUPABASE_READY.md`, including tables, Row Level Security policies and migration steps.

### Are permissions real?

They are enforced at UI and workflow level in the demo. Buttons and actions are disabled based on Admin, Angajat and Angajat nou roles. In production, the same permissions would also be enforced by Supabase Row Level Security.

### Why so many modules?

The goal is to show product thinking, not only UI building. ClientFlow PRO demonstrates onboarding, CRM, operations, role management, automations, reporting, booking, portal previews and migration planning in one coherent product.

### What would be the first production upgrade?

Move auth, team access, clients, tasks and automations to Supabase, then enforce permissions through RLS and replace local invite IDs with signed invite tokens.

## 15-second fallback pitch

ClientFlow PRO is a multi-industry CRM and operations suite for small service businesses. It supports industry-specific setup, role-based access, CRM, tasks, invoices, booking, automations, notifications and a Supabase-ready migration path — all available in a free local-first live demo.
