# Supabase-ready architecture

ClientFlow PRO is currently local-first. This document maps the current browser storage model to a future Supabase backend without changing the product UX.

## Core principles

- Keep the current UI and route structure.
- Replace `localStorage` adapters with Supabase queries gradually.
- Preserve demo mode as seeded workspace data.
- Use Row Level Security by workspace membership and permission role.
- Keep invite links as signed tokens in production, not raw local IDs.

## Suggested tables

### workspaces

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| name | text | Workspace name |
| owner_id | uuid | References users.id |
| industry | text | beauty, auto, kineto, psychology, custom |
| custom_industry | text | Optional custom domain |
| client_label | text | e.g. Client, Pacient, Client service auto |
| service_label | text | e.g. Serviciu, Intervenție auto, Ședință |
| status_labels | jsonb | Custom pipeline/status labels |
| custom_fields | jsonb | CRM custom fields |
| created_at | timestamptz | Default now() |

### users

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Supabase auth user id |
| full_name | text | Display name |
| email | text | Unique |
| created_at | timestamptz | Default now() |

### team_access

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| workspace_id | uuid | References workspaces.id |
| user_id | uuid | Nullable until accepted |
| name | text | Invitee name |
| email | text | Invitee email |
| role | text | admin, employee, new_employee |
| permissions | jsonb | view/add/edit/delete/managePermissions/validateClientStatus/fullAccess |
| invite_token | text | Signed token in production |
| status | text | pending, active, revoked |
| created_at | timestamptz | Default now() |

### clients

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| workspace_id | uuid | References workspaces.id |
| name | text | Client/patient/customer name |
| company | text | Optional company |
| email | text | Contact email |
| phone | text | Contact phone |
| status | text | lead/active/inactive or mapped status |
| stage | text | new/qualified/proposal/negotiation/won/paused |
| monthly_value | numeric | Revenue value |
| health_score | int | 0-100 |
| tags | jsonb | Array |
| custom_fields | jsonb | Per-workspace custom values |
| pinned | boolean | Priority account |
| archived | boolean | Soft delete |
| created_at | timestamptz | Default now() |

### tasks

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| workspace_id | uuid | References workspaces.id |
| client_id | uuid | Nullable references clients.id |
| title | text | Task/service/session title |
| description | text | Details |
| status | text | todo/in_progress/done or mapped status |
| priority | text | low/medium/high |
| due_date | date | Optional |
| recurrence | text | none/daily/weekly/monthly |
| tags | jsonb | Array |
| subtasks | jsonb | Could become task_subtasks table later |
| comments | jsonb | Could become task_comments table later |
| archived | boolean | Soft delete |
| created_at | timestamptz | Default now() |

### invoices

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| workspace_id | uuid | References workspaces.id |
| client_id | uuid | Optional references clients.id |
| client | text | Snapshot name |
| service | text | Service snapshot |
| amount | numeric | Invoice amount |
| status | text | draft/sent/paid |
| due_date | date | Due date |
| created_at | timestamptz | Default now() |

### service_templates

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| workspace_id | uuid | References workspaces.id |
| name | text | Package name |
| price | numeric | Default price |
| duration | text | e.g. Monthly, 2 weeks, 50 min |
| deliverables | text | Description |
| created_at | timestamptz | Default now() |

### time_entries

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| workspace_id | uuid | References workspaces.id |
| client | text | Snapshot name |
| task | text | Snapshot task/service |
| hours | numeric | Billable hours |
| date | date | Entry date |
| created_at | timestamptz | Default now() |

### bookings

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| workspace_id | uuid | References workspaces.id |
| client | text | Client name |
| email | text | Contact email |
| phone | text | Contact phone |
| service | text | Booked service |
| stylist | text | Staff member / practitioner |
| date | date | Appointment date |
| time | text | Appointment time |
| status | text | booked/pending/completed/vip-follow-up |
| spend | numeric | Estimated spend |
| notes | text | Preferences or appointment notes |
| retention_label | text | New/Returning/VIP/At risk |
| created_at | timestamptz | Default now() |

### client_portals

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| workspace_id | uuid | References workspaces.id |
| client_id | uuid | Optional references clients.id |
| access_code | text | Public preview code; use signed tokens in production |
| status | text | active/preview/paused |
| visible_sections | jsonb | Tasks, invoices, timeline, proposal |
| created_at | timestamptz | Default now() |

### demo_plans

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| workspace_id | uuid | References workspaces.id |
| product_url | text | Demo URL |
| style | text | SaaS Clean, Launch Teaser, etc. |
| duration | int | Seconds |
| objective | text | Demo objective |
| readiness | int | 0-100 |
| shots | jsonb | Shot list |
| created_at | timestamptz | Default now() |

### impact_goals

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| workspace_id | uuid | References workspaces.id |
| title | text | Goal title |
| metric | text | Metric name |
| current | numeric | Current value |
| target | numeric | Target value |
| due_date | date | Deadline |
| created_at | timestamptz | Default now() |

### automation_rules

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| workspace_id | uuid | References workspaces.id |
| name | text | Rule name |
| trigger | text | overdue-task, invoice-sent, etc. |
| action | text | Action description |
| enabled | boolean | Active flag |
| last_run_at | timestamptz | Last manual/scheduled run |
| created_at | timestamptz | Default now() |

### notifications

| Column | Type | Notes |
| ------ | ---- | ----- |
| id | uuid | Primary key |
| workspace_id | uuid | References workspaces.id |
| user_id | uuid | Optional recipient |
| title | text | Notification title |
| message | text | Notification body |
| type | text | task/invoice/booking/client/system |
| read | boolean | Read state |
| created_at | timestamptz | Default now() |

## LocalStorage to Supabase mapping

| Local key | Supabase table |
| --------- | -------------- |
| clientflow_workspace_profile | workspaces |
| clientflow_team_access | team_access |
| clientflow_clients | clients |
| clientflow_tasks | tasks |
| clientflow_suite_invoices | invoices |
| clientflow_suite_services | service_templates |
| clientflow_suite_time_entries | time_entries |
| clientflow_suite_portals | client_portals |
| clientflow_suite_beauty_bookings | bookings |
| clientflow_suite_demo_plans | demo_plans |
| clientflow_suite_impact_goals | impact_goals |
| clientflow_suite_automation_rules | automation_rules |
| clientflow_suite_notifications | notifications |

## RLS policy sketch

- Admin can select, insert, update and delete all workspace records.
- Employee can select workspace records, insert operational records and update client/task status.
- New employee can select only.
- All policies include `workspace_id in team_access where user_id = auth.uid()`.
- Invite acceptance should validate a signed invite token and attach the auth user to `team_access.user_id`.

## Migration path

1. Create Supabase project and tables.
2. Add `workspace_id` to all local records during migration.
3. Replace `suiteStorage.ts` with Supabase adapters one module at a time.
4. Replace local auth session with Supabase Auth.
5. Move invite links from local IDs to signed tokens.
6. Add scheduled Edge Function for automation rules.
7. Keep local demo fallback for portfolio mode.
