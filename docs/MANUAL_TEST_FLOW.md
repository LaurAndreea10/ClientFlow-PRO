# Manual Test Flow

Use this checklist after each final polish commit and before sharing the portfolio link.

## QA commands

Run locally or check GitHub Actions:

```bash
npm run typecheck
npm run build
```

Expected result: both commands complete without TypeScript or Vite build errors.

## Manual route flow

| Step | Route | Expected result |
| ---- | ----- | --------------- |
| 1 | `/#/` | Public landing page loads with CTA buttons, industries, roles and demo credentials. |
| 2 | `/#/login` | Login page loads and Try Demo button is visible. |
| 3 | Try Demo | User enters the app and lands in the protected demo workspace. |
| 4 | `/#/start-here` | Guided demo path is visible. |
| 5 | `/#/demo-script` | 60-second pitch, route plan and FAQ are visible. |
| 6 | `/#/command-center` | Operational KPIs and next actions load. |
| 7 | `/#/workspace-setup` | Workspace profile, industry configuration, roles and invite links load. |
| 8 | `/#/clients` | Industry-aware labels and permission-aware actions are visible. |
| 9 | `/#/automations` | Automation rules load and Run/Manage buttons respect permissions. |
| 10 | `/#/portfolio-score` | Readiness checklist shows completed portfolio criteria. |

## Permission checks

### Admin

Expected:

- Can add records.
- Can edit/status-update records.
- Can archive/delete where available.
- Can manage permissions.
- Can restore backups.

### Angajat

Expected:

- Can view records.
- Can add records.
- Can validate/update status where allowed.
- Cannot delete/archive admin-only data.
- Cannot manage permissions.

### Angajat nou

Expected:

- Can view records.
- Add/Edit/Delete/status buttons are disabled.
- Restore backup and permission management are disabled.

## Industry checks

Create a workspace for each industry and verify the seed data/labels:

| Industry | Expected labels / data |
| -------- | ---------------------- |
| Beauty | Booking, stylists, services, VIP retention |
| Mecanic auto | Fișă mașină, diagnoză, deviz, reparație, predare |
| Kinetoterapeut | Pacient, diagnostic, plan tratament, ședințe, progres |
| Psiholog | Intake, consimțământ, ședință, confidențialitate, follow-up |
| Custom | Editable custom labels, statuses and fields |

## GitHub repository metadata

Use this in GitHub → Settings → General → About.

### Description

```txt
Multi-industry CRM & operations suite built with React, TypeScript, PWA, local-first storage, role-based access, automations, bookings, invoices, demo flow and Supabase-ready architecture.
```

### Website

```txt
https://laurandreea10.github.io/ClientFlow-PRO/#/
```

### Topics

```txt
react, typescript, vite, crm, dashboard, pwa, portfolio-project, saas, local-first, automation, supabase-ready, role-based-access, booking-system
```

## Stop condition

After CI is green and this manual flow passes, stop adding new features. The project is already positioned as a complete portfolio product.
