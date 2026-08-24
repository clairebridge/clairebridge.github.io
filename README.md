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

This repo is set up for static hosting.

1. In the GitHub repo, open **Settings → Pages**.
2. Set source to **GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys `dist/`.

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
