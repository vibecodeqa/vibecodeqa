# 1 · Project setup

The foundation: how a `react-spa` repo is bootstrapped, structured at the top level, and
wired to build. Get these right and every later rule has somewhere to stand.

## Rules

### R-SETUP-1 · Static build, no server of its own

**Rule.** The app builds to static assets with `vite build` and serves every request from
a folder of files — no Node process, no SSR step, is required to render a page.

**Why.** This is the archetype's defining constraint. If a server is needed to render HTML,
it is a `react-ssr` app and a different standard applies. A static build is cacheable at
the edge, trivially hostable (R2, Pages, any CDN), and has no runtime to keep alive.

**vcqa.** `build` script ends in `vite build`; no `next`/`nuxt`/`remix`/`express`/`hono` in
deps; output is a static `dist/`.

### R-SETUP-2 · Vite is the bundler

**Rule.** The build tool is **Vite** with `@vitejs/plugin-react`. Not Create React App
(unmaintained), not a hand-rolled webpack config.

**Why.** Vite is the ecosystem default for client React in 2026: fast dev server, native
ESM, first-class TS, mature plugin surface. CRA is deprecated and its `react-scripts` lag
React and browser targets.

```jsonc
// package.json (web) — the target
"devDependencies": {
  "vite": "^8",
  "@vitejs/plugin-react": "^6"
}
```

**vcqa.** `vite` present; `react-scripts` **absent**; `vite.config.ts` exists.

### R-SETUP-3 · Current React and TypeScript

**Rule.** React and `react-dom` are on **19.x**; the project is TypeScript on **5.7+**
(6.x preferred). JavaScript-only React SPAs fail this rule.

**Why.** React 19 is the current major (Actions, `use`, improved Suspense, ref-as-prop).
Types catch the class of bug that static apps can't catch at runtime for the user.

**vcqa.** `react` satisfies `>=19`; `typescript` present and `>=5.7`; `.tsx` sources, not
`.jsx`.

### R-SETUP-4 · pnpm, with the app in a `web` package

**Rule.** The package manager is **pnpm**. The frontend lives in its own package (the house
layout is a workspace root with a `web` package holding the Vite app), so tooling,
scripts, and future siblings (e2e, a worker) each have a home.

**Why.** pnpm's strict, content-addressed store prevents phantom dependencies — a real
correctness issue for a bundle shipped to users. Isolating the app in `web` keeps the root
as an orchestration layer and lets `pnpm --filter` target precisely.

```
repo/
├─ package.json          # workspace root: scripts delegate via --filter
├─ pnpm-workspace.yaml
└─ web/                  # the Vite app
   ├─ index.html
   ├─ vite.config.ts
   ├─ src/
   └─ e2e/              # Playwright (see Testing)
```

**vcqa.** `pnpm-lock.yaml` present (no `package-lock.json`/`yarn.lock`); `packageManager`
field pins pnpm; a `web` (or single app) package holds `index.html` + `vite.config.ts`.

### R-SETUP-5 · Node 22+ pinned

**Rule.** The supported Node version is declared (`engines.node >= 22`) and matched in CI.

**Why.** Build reproducibility. The bytes users receive depend on the toolchain that built
them; an unpinned Node lets CI drift from local and from itself over time.

**vcqa.** `engines.node` present and `>= 20`; CI `setup-node` version agrees.

### R-SETUP-6 · Relative asset base

**Rule.** `vite.config.ts` sets `base: './'` (relative), not the default `'/'`.

**Why.** A static SPA is frequently served under a path prefix or behind a proxy
(`example.com/app/`, a preview URL, a host worker that strips a prefix). With the default
absolute base the built HTML requests `/assets/*` at the domain root, bypassing the proxy
and 404-ing. Relative `./assets/*` resolves correctly under any prefix *and* when hit
directly. This is the single most common cause of a "blank page in production, works
locally" SPA failure.

```ts
// vite.config.ts
export default defineConfig({
  base: './',              // ✅ works under any path prefix
  plugins: [react(), tailwindcss()],
});
```

**vcqa.** `vite.config.*` sets `base` to a relative value; flag an explicit `base: '/'`
when the deploy target is path-prefixed.

### R-SETUP-7 · The four scripts

**Rule.** The app exposes `dev`, `build`, `preview`, and `typecheck`. `build` runs the type
checker before bundling (`tsc -b && vite build`).

**Why.** A predictable script surface is what CI, contributors, and tools assume. Building
through `tsc -b` first means a type error fails the build instead of shipping.

```jsonc
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc -b"
}
```

**vcqa.** `dev`, `build`, `preview`, `typecheck` all present; `build` invokes `tsc` before
`vite build`.

### R-SETUP-8 · StrictMode at the root

**Rule.** The app is mounted with `createRoot(...).render(<StrictMode><App/></StrictMode>)`.

**Why.** StrictMode surfaces unsafe lifecycles, impure renders, and missing effect cleanup
in development — the bugs that later become production flicker and leaks. It costs nothing
in the production build.

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

**vcqa.** Entry uses `createRoot` (not legacy `ReactDOM.render`) and wraps the tree in
`StrictMode`.

## Checklist

- [ ] Builds to static assets with `vite build`; no server needed to render (**R-SETUP-1**)
- [ ] Vite + `@vitejs/plugin-react`; no CRA (**R-SETUP-2**)
- [ ] React 19 + TypeScript 5.7+ (**R-SETUP-3**)
- [ ] pnpm; app isolated in a `web` package (**R-SETUP-4**)
- [ ] Node 22+ pinned in `engines` and CI (**R-SETUP-5**)
- [ ] `base: './'` in Vite config (**R-SETUP-6**)
- [ ] `dev` / `build` / `preview` / `typecheck` scripts; build type-checks first (**R-SETUP-7**)
- [ ] `StrictMode` + `createRoot` at the entry (**R-SETUP-8**)
