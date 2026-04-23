# ClientFlow Pro v10

ClientFlow Pro is a mobile-first CRM and workflow dashboard built with React, TypeScript and local-first storage.

## What is included
- dashboard, reports, calendar, settings, activity log
- clients CRUD and tasks CRUD
- Kanban board with drag and drop
- search overlay
- sorting, filtering and bulk actions
- toast notifications + notification center
- activity / audit trail
- CSV import/export for clients and tasks
- JSON export/import for the workspace
- dark / light mode
- English / Romanian toggle
- PWA files (manifest + service worker)
- accessibility improvements: focus states, labels, keyboard-friendly controls
- test files included for helpers and UI placeholders

## Cost
This version does **not** require any paid backend or API.
Everything runs locally in the browser through `localStorage`.

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Notes
- The current adapter runs in `local` mode.
- The codebase is prepared for a future Supabase migration, but that is not enabled here so you avoid mandatory costs.
