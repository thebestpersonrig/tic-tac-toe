# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server at http://localhost:4321/minigames/
npm run build     # Build static site to dist/
npm run preview   # Preview production build
npm test          # Run Playwright tests (auto-starts dev server)
npm run test:ui   # Run tests in interactive UI mode
npx playwright test tests/tic-tac-toe.spec.ts  # Run a single test file
```

## Architecture

This is an **Astro static site** deployed to GitHub Pages at `https://thebestpersonrig.github.io/minigames/`. The `base: '/minigames'` in `astro.config.mjs` is critical — all internal links and asset paths must account for it.

**Layout chain:** Every page uses `BaseLayout.astro` (bare HTML shell) directly or via `GameLayout.astro` (adds a fixed "← Games" back-link). Game pages pass `title` as a prop.

**Game pages** live in `src/pages/games/` as single `.astro` files. Each game is entirely self-contained — all game logic is written as a vanilla JS IIFE inside a `<script is:inline>` block at the bottom of the file, with no external JS modules or imports. CSS is scoped with `<style>` (component-scoped) and `<style is:global>` for body/html rules.

**Adding a new game:** Create `src/pages/games/<name>.astro` using `GameLayout`, add a card to `src/pages/index.astro`, and place an icon in `public/`.

## Workflow

After every fix or change, commit the changes with a descriptive message, push the branch to `origin`, and open a GitHub Pull Request targeting `main`.

## Key implementation details

- **Base URL in links:** Use `import.meta.env.BASE_URL` in `.astro` frontmatter for hrefs (see `GameLayout.astro`). Inside `<script is:inline>`, `BASE_URL` is not available — hardcode `/minigames/` or read it from a data attribute.
- **Obstacle density** is a float (e.g. `0.015`) selected from the dropdown and passed directly to `Math.floor(COLS * ROWS * density)` in `placeObstacles()`.
- **Snake speed** is controlled by `DIFFICULTIES[diff].interval` (ms per tick) — lower = faster.
- **Playwright tests** run against `http://localhost:4321` with base path `/minigames`. Tests cover both `chromium` (Desktop Chrome) and `mobile` (iPhone 13) projects in parallel.
- **Deployment** triggers automatically on push to `main` via GitHub Actions (`.github/workflows/deploy.yml`).
