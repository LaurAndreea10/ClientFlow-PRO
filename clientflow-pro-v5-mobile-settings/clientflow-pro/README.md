# ClientFlow Pro — mobile-first free portfolio app

ClientFlow Pro is a polished CRM-style dashboard built with React, TypeScript, Vite and React Query.
This edition is designed to look stronger in a junior front-end portfolio while staying **free-first** and easy to run.

## Why this version is useful for recruiters

- mobile-first layout instead of a desktop-only demo
- realistic dashboard, clients and tasks flow
- edit + delete actions for both clients and tasks
- search and filters that make the app feel more real
- portfolio-ready empty states and cleaner presentation
- local persistence, so the reviewer can test it immediately

## What is included

- mock auth flow
- protected routes
- dashboard metrics
- client CRUD with edit flow
- task CRUD with edit flow
- notes per client
- settings/profile page
- export and reset workspace tools
- chart for client status
- mobile bottom navigation
- polished empty states and pills
- portfolio-style dark SaaS UI

## Why this version avoids costs

- no Supabase required
- no paid API required
- no server required
- no hosting required to test locally
- data persists locally in the browser with `localStorage`

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

## Good GitHub presentation checklist

- add 3–5 screenshots from mobile and desktop
- pin the repo on your profile
- write 4–6 bullets in the README about what you built
- include a short GIF for login, add client, edit task

## Upgrade path later

When you want a real backend, you can replace `src/lib/mockApi.ts` with:

- Supabase free tier
- Firebase free tier
- your own Node/Express API

The UI and most of the page structure can stay the same.


## Portfolio talking points

- built a mobile-first CRM dashboard with React and TypeScript
- created reusable views for clients, tasks, notes and settings
- added local persistence and reviewer-friendly reset/export flows
- used React Query to organize async state even in a mock local-first setup
- kept the app deployable later to a real API without rewriting the UI structure
