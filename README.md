# Claire's portfolio

Static UX/UI portfolio shell. Home is designed; About, Work, and Contact are placeholders with the shared nav.

## Local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

The production build writes `dist/`, plus `dist/404.html` (SPA fallback) and `dist/.nojekyll`.

## GitHub Pages

GitHub Pages can only serve static files. It cannot run TypeScript, so each build compiles the app to JavaScript and writes that compiled site to the repo root (`index.html`, `assets/`, `404.html`).

Push to `main` to rebuild. The workflow in `.github/workflows/deploy.yml` compiles the site and publishes it.

`vite.config.ts` sets the asset base from the repo name when `GITHUB_PAGES=true`:

- Project site (`username.github.io/repo-name`) → `base: /repo-name/`
- User site (`username.github.io`) → `base: /`

To preview that production base locally:

```bash
GITHUB_PAGES=true GITHUB_REPOSITORY=yourname/your-repo npm run build
npm run preview
```

## Swap placeholder content

- Name, hook, and status live in `src/pages/Home.tsx`
- Rotating skills live in `src/data/skills.ts`
- Portrait lives in `src/assets/images/claire-headshot.png` — replace that file or point `src/components/home/HeroCollage.tsx` at a new photo
# clairebridge.github.io
