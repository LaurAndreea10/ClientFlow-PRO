# v1.0.0 — Portfolio Demo

ClientFlow PRO v1.0.0 is the first portfolio-ready release of the project.

## Live demo

- Landing page: https://laurandreea10.github.io/ClientFlow-PRO/#/
- Login demo: https://laurandreea10.github.io/ClientFlow-PRO/#/login
- Guided demo: https://laurandreea10.github.io/ClientFlow-PRO/#/start-here

## Demo credentials

| Field | Value |
| ----- | ----- |
| Email | `demo@clientflow.pro` |
| Password | `demo1234` |

## What is included

- Public landing page
- Login page optimized for fast demo entry
- One-click Try Demo flow
- Guided Start Here route
- In-app Demo Script
- Multi-industry workspace onboarding
- Industry templates for Beauty, Auto, Kineto, Psychology and Custom workspaces
- Domain-specific seed data
- Role-based UI permissions
- Admin, employee and view-only access profiles
- Admin-generated local invite links
- CRM, tasks, services, invoices and time tracking
- Beauty Studio booking and retention module
- Client portal preview
- Command Center
- Global Search
- Automations and Notifications
- Reports, Calendar and Activity Log
- Demo Planner and Impact Goals
- Portfolio Score
- Backup / Restore JSON
- Product Case Study
- Manual Test Flow
- Supabase-ready architecture documentation
- PWA-ready setup
- GitHub Pages-safe HashRouter routing

## Positioning

ClientFlow PRO is a portfolio-grade CRM prototype with local-first workflows and Supabase-ready architecture. It is not positioned as a production SaaS with live backend auth yet. The demo uses browser localStorage so recruiters can test the product without signup friction or paid services.

## Recommended review path

1. Open `/#/`
2. Click Try Demo
3. Open `/#/start-here`
4. Open `/#/demo-script`
5. Open `/#/command-center`
6. Open `/#/workspace-setup`
7. Open `/#/clients` or `/#/tasks`
8. Open `/#/automations`
9. Open `/#/portfolio-score`

## Technical stack

- React
- TypeScript
- Vite
- React Query
- Recharts
- LocalStorage
- PWA setup
- GitHub Pages

## Trade-offs

- Local-first storage keeps the demo free and easy to reset, but there is no real multi-device sync yet.
- Access links and permissions are UI/workflow simulations; production enforcement should use backend auth and Row Level Security.
- AI Copilot and automations are deterministic and local, not backed by paid APIs.
- Client portal links are simulated previews, not secure public links.

## Suggested GitHub Release title

```txt
v1.0.0 — Portfolio Demo
```

## Suggested GitHub Release description

```txt
First portfolio-ready release of ClientFlow PRO: a multi-industry CRM and operations suite built with React, TypeScript and Vite.

Includes public landing, one-click demo login, guided demo flow, role-based UI permissions, industry-specific CRM setup, domain seed data, automations, notifications, invoices, bookings, portfolio score, product case study and Supabase-ready architecture documentation.
```
