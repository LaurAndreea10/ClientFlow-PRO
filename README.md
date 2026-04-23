# ClientFlow Pro

A portfolio-ready CRM and workflow dashboard built with React + TypeScript.

## Why this version avoids costs

This starter **does not require any paid service**.
It runs locally and stores demo data in **browser localStorage** by default.

You can use it in two ways:

1. **Completely free, no account needed**
   - run locally
   - use mock auth
   - use localStorage data

2. **Optional later upgrade**
   - connect Supabase only if you want
   - deploy on free tiers when you are ready

## Features

- login/register flow (mock, free)
- protected routes
- dashboard stats
- clients CRUD
- tasks CRUD
- notes per client
- filters and search
- charts with Recharts
- local persistence with localStorage

## Getting started

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Demo login

Use any email and password you want in this starter.
The app creates a local mock session in your browser.

Example:
- email: demo@clientflow.local
- password: 123456

## Tech stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Recharts

## Project structure

```bash
src/
  components/
  features/
  lib/
  pages/
  routes/
  types/
```

## No-cost roadmap

You asked to avoid costs, so the best path is:

- build locally with this version
- publish screenshots/GIFs to GitHub
- optionally deploy on Vercel free tier later
- only add Supabase if you actually need real remote auth/database

## If you want to add Supabase later

This project is structured so you can swap the local API with a real backend later.
Start with:
- auth
- clients table
- tasks table
- notes table

But this zip itself does **not** depend on Supabase.

## Suggested repo description

`CRM-style client and task dashboard built with React, TypeScript, TanStack Query, and local mock API.`

## What makes it portfolio-ready

- real app layout
- multiple pages
- route protection
- reusable cards/tables/forms
- state management with server-style query hooks
- persistent data, even without paid services
