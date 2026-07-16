# React SPA — Gold Standard

This is the **reference standard for one application archetype**: a React app that is
**client-rendered and served as static files** — no server-side rendering, no server of
its own. Data comes from external APIs or a platform SDK; the whole app compiles to a
folder of static assets behind a CDN.

It exists to be **judged against**. [VibeCode QA](https://vibecodeqa.online) detects a
repo's archetype, loads the matching standard, and scores the code against its rules. A
human reading a review sees *"fails **R-BUILD-2** — assets use absolute base"* and can
click straight to the clause.

## When this standard applies

A repo is a **`react-spa`** when all of these hold:

- `react` + `react-dom` are dependencies, and
- a browser bundler is present (`vite`, `webpack`, `esbuild`), and
- **no** server framework is present — no `next`, `nuxt`, `sveltekit`, `remix`,
  `react-router`'s framework/SSR mode, `express`, `hono`, or `fastify`, and
- the build output is static (`dist/` of HTML/JS/CSS served by a CDN or host worker).

If a server renders the HTML, it is **not** this archetype — see the sibling `react-ssr`
standard. If there is a backend service in the same repo, that part is judged by
`node-service`. Language, testing, accessibility, and security rules that apply to *every*
archetype live in the cross-cutting standards and are layered on top.

## The archetype in one table

| Axis | Gold-standard choice (v1) |
| --- | --- |
| UI | **React 19** — function components, hooks, `StrictMode` |
| Language | **TypeScript** (strict), project references |
| Build | **Vite** — `@vitejs/plugin-react` |
| Styling | **Tailwind CSS v4** via `@tailwindcss/vite` (CSS-first) |
| Package manager | **pnpm** (workspace: root + `web` package) |
| Routing | none for single-view; `react-router-dom` v7 in **SPA/library mode** when multi-view |
| Data | external API / platform SDK; **no server of its own** |
| Offline/install | `vite-plugin-pwa` (optional) |
| Tests | **Vitest** + Testing Library + **Playwright** |
| Hosting | static `dist/` on a CDN / host worker, SPA fallback, relative asset base |

The choices above are **prescriptions inside** the standard, not the boundary of it.
Swapping Tailwind for CSS Modules does not change the archetype — it changes one rule's
verdict. The boundary is *React + client-rendered + static-hosted*.

## Editions

Best practice for this archetype moves when the ecosystem moves (a React major, a Vite
major, a new consensus) — **not** on a fixed calendar. So editions are **versioned on
change**, and each carries a review date so it can't silently rot.

| Edition | Targets | Reviewed | Next review due | Status |
| --- | --- | --- | --- | --- |
| **[v1](v1/index.md)** | React 19 · Vite 8 · Tailwind 4 · TS 6 | 2026-07 | 2027-07 | **latest** |

vcqa pins an edition (`react-spa@v1`) and surfaces the review date as a staleness signal:
*"judged against a standard last verified N months ago."*

---

*FreeDocStore publishes one such standard per archetype (`react-spa`, `react-ssr`,
`vue-spa`, `node-service`, `flutter-app`, …). Each is the gold standard a scanner judges
that archetype against.*
