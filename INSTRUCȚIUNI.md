# ClientFlow-PRO — Fișiere adăugate și pași de integrare

## Ce conține pachetul

```
.github/
  workflows/
    ci.yml                    # CI optimizat (typecheck + test + build)
    deploy.yml                # Deploy automat la GitHub Pages
  ISSUE_TEMPLATE/
    bug_report.yml            # Template bilingv pentru bug reports
    feature_request.yml       # Template bilingv pentru features
    config.yml                # Config issue templates
  dependabot.yml              # Update-uri automate grupate
  pull_request_template.md    # Template PR bilingv (exista deja, e îmbunătățit)
LICENSE                       # MIT
CONTRIBUTING.md               # Ghid bilingv RO/EN
.gitignore                    # Complet pentru Vite + React + TS
.nvmrc                        # Node 20 pinned
.editorconfig                 # Stil consistent
```

## Pași de integrare (în această ordine)

### 1. Verifică ce ai deja

Clonează local dacă nu ai deja:
```bash
git clone https://github.com/LaurAndreea10/ClientFlow-PRO.git
cd ClientFlow-PRO
```

### 2. Copiază fișierele

Copiază toate fișierele din acest pachet peste cele existente.
Dacă ai deja `ci.yml` sau `pull_request_template.md`, versiunile din pachet
sunt optimizate — le poți suprascrie în siguranță.

### 3. Verifică `package.json`

Scripturile pe care le folosesc workflow-urile:
- `npm run typecheck`
- `npm run test` (opțional, folosește `--if-present`)
- `npm run build`

Dacă nu ai `typecheck`, adaugă în `package.json`:
```json
"scripts": {
  "typecheck": "tsc --noEmit"
}
```

### 4. Activează GitHub Pages

1. Settings → Pages (dacă e albă, vezi secțiunea "Pagina albă" mai jos)
2. La **Source**, selectează **GitHub Actions** (nu "Deploy from branch")
3. Salvează

### 5. Verifică `vite.config.ts`

Pentru GitHub Pages, `base` trebuie să fie corect setat:
```ts
export default defineConfig({
  base: '/ClientFlow-PRO/',
  plugins: [react()],
  // ...
})
```

### 6. Fișierul `tsconfig.tsbuildinfo`

Acest fișier **nu ar trebui să fie commit-at** — e generat de TypeScript
pentru cache incremental. Rulează:
```bash
git rm --cached tsconfig.tsbuildinfo
git commit -m "chore: remove tsbuildinfo from tracking"
```
Noul `.gitignore` îl ignoră automat de acum.

### 7. Commit și push

```bash
git add .github LICENSE CONTRIBUTING.md .gitignore .nvmrc .editorconfig
git commit -m "ci: add zero-cost CI/CD pipeline and portfolio metadata"
git push origin main
```

După push, mergi la tab-ul **Actions** și ar trebui să vezi:
- CI rulând (typecheck + build)
- Deploy to GitHub Pages rulând în paralel

După ~2 minute, site-ul va fi live la:
**https://laurandreea10.github.io/ClientFlow-PRO/**

## Pagina albă la Settings — soluții

Dacă Settings încă e albă după toate astea:

1. **CLI via GitHub CLI** (cel mai rapid):
   ```bash
   gh auth login
   gh api repos/LaurAndreea10/ClientFlow-PRO --jq '.has_pages, .default_branch'
   gh api -X POST repos/LaurAndreea10/ClientFlow-PRO/pages \
     -f build_type=workflow
   ```

2. **Disable extensii** (uBlock, Privacy Badger, Ghostery)
3. **Incognito** + cont GitHub logat
4. **Alt browser** (Firefox dacă folosești Chrome, invers)

## Cost total

- **Repo public**: ✅ Actions nelimitate
- **GitHub Pages**: ✅ gratuit, bandwidth soft-limit 100GB/lună
- **Dependabot**: ✅ gratuit
- **Artefacte build**: ✅ 500MB storage gratuit, expiră în 7 zile (setat în workflow)

**Total: 0 €/lună**

## Ce NU am inclus (și de ce)

- **Vercel/Netlify configs** — GitHub Pages e suficient pentru un CRM static.
  Vercel adaugă valoare doar dacă vrei preview URLs pe fiecare PR.
- **Lighthouse CI** — util dar consumă minute suplimentare. Rulează local cu
  `npx lighthouse https://... --view` când vrei un audit.
- **Codecov** — proiectul nu are încă teste consistente; adaugă când ai >50%
  coverage.
- **ESLint workflow separat** — typecheck-ul deja prinde majoritatea problemelor.
  Dacă adaugi ESLint, integrează-l în jobul `quality` din `ci.yml`.

## Upgrade-uri opționale pentru mai târziu

Când ești gata:

1. **Custom domain** gratuit cu GitHub Pages (ai nevoie doar de domeniu)
2. **Supabase free tier** pentru auth + DB real (0 € până la 500MB)
3. **Cloudflare Pages** ca alternativă dacă depășești bandwidth-ul Pages
