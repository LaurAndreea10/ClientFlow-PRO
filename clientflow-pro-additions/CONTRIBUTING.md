# Contributing / Contribuire

EN: This is a portfolio project, but contributions and suggestions are welcome.
RO: Acesta este un proiect de portofoliu, dar contribuțiile și sugestiile sunt binevenite.

## Setup

```bash
nvm use           # uses version from .nvmrc
npm install
npm run dev
```

## Quality checks / Verificări de calitate

Before opening a PR / Înainte de a deschide un PR:

```bash
npm run typecheck
npm run test
npm run build
```

## Commit convention

Follow Conventional Commits / Urmează Conventional Commits:

- `feat:` new feature / funcționalitate nouă
- `fix:` bug fix / corectare bug
- `docs:` documentation / documentație
- `style:` formatting / formatare
- `refactor:` code restructuring / restructurare cod
- `perf:` performance / performanță
- `test:` tests / teste
- `chore:` maintenance / mentenanță
- `ci:` CI/CD changes / modificări CI/CD

## Branch naming

- `feat/short-description`
- `fix/short-description`
- `docs/short-description`

## Code style

EN: The repo uses EditorConfig and TypeScript strict mode. Keep components small, use existing design tokens, preserve the mobile-first layout.
RO: Repo-ul folosește EditorConfig și TypeScript strict. Menține componentele mici, folosește tokens-urile de design existente, păstrează layout-ul mobile-first.

## i18n

EN: All user-facing strings must exist in both RO and EN.
RO: Toate stringurile vizibile utilizatorului trebuie să existe în ambele limbi, RO și EN.
