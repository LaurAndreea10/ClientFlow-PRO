# ClientFlow Pro — Free-first portfolio app

ClientFlow Pro is a polished CRM-style dashboard built with React, TypeScript, Vite and React Query.
This version is intentionally **free-first**: it works entirely in the browser using `localStorage`, so it does **not** require paid hosting, databases or API subscriptions.

## What is included

- mock auth flow
- protected routes
- dashboard metrics
- client CRUD
- task CRUD
- notes per client
- chart for client status
- portfolio-style dark SaaS UI

## Why this version avoids costs

- no Supabase required
- no paid API required
- no server required
- data persists locally in the browser

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## Tech stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Recharts
- localStorage as mock persistence

## Upgrade path later

When you want a real backend, you can swap the functions from `src/lib/mockApi.ts` with:

- Supabase free tier
- Firebase free tier
- your own Node/Express API

The rest of the UI structure can stay largely the same.

## Project structure

```bash
src/
  components/
  data/
  features/
  lib/
  pages/
  routes/
  types/
```

## Portfolio note

This starter is designed to look stronger on GitHub than a basic todo app while still staying easy to run and free to use.
