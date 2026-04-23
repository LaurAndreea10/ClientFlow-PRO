ClientFlow cover
A mobile-first CRM and workflow dashboard built with React, TypeScript, and local-first storage.

It is designed to look and feel like a real SaaS product while staying free to run: no paid backend, no paid API, no hosting bill required to use it locally.

What this version includes
Dashboard, Clients, Tasks, Reports, Calendar, Activity, Settings
Clients CRUD with favorites, archive, tags, notes template, duplicate, CSV import/export, bulk actions
Tasks CRUD with list + Kanban drag-and-drop, recurring tasks, subtasks, mock attachments, archive, duplicate, CSV import/export, bulk actions
Notes timeline per client
Search overlay / command style access, keyboard shortcuts, onboarding, toasts, notifications, undo delete
Reports with printable/PDF-ready export
Dark and light theme
English and Romanian toggle
PWA-ready manifest, service worker and offline fallback page
CI, issue templates, PR template, portfolio assets
Cost model
Required monthly cost: €0

storage: browser localStorage
backend: not required
paid API: not required
hosting: optional
Screenshots and presentation assets
public/portfolio/cover.svg
public/portfolio/dashboard-preview.svg
public/portfolio/mobile-preview.svg
public/portfolio/reports-preview.svg
Architecture
src/
  components/
  data/
  features/
  lib/
  pages/
  routes/
Getting started
npm install
npm run dev
Quality checks
npm run typecheck
npm run test
npm run build
Repo description
Mobile-first CRM & workflow dashboard built with React, TypeScript, PWA support, recurring tasks, Kanban, analytics, import/export, and local-first storage.

Repo topics
react typescript vite crm dashboard kanban pwa portfolio-project localstorage mobile-first

Trade-offs
kept the app local-first to avoid cost and deployment complexity
mock attachments stay metadata-only, not real cloud uploads
PDF export uses the browser print flow instead of a paid document service
service worker is intentionally simple and portfolio-friendly
Future upgrades that would add external dependencies
real auth and sync with Supabase free tier
multi-user collaboration
real file uploads
persistent server-side audit trail
