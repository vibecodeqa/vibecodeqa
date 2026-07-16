# React SPA — Edition v1

!!! info "Edition metadata"
    **Targets:** React 19 · Vite 8 · Tailwind CSS 4 · TypeScript 6 · pnpm · Node 22+
    **Reviewed:** 2026-07 · **Next review due:** 2027-07
    **Status:** latest · **Pin as:** `react-spa@v1`

This edition captures the gold standard for the **`react-spa`** archetype as of mid-2026.
It is the rubric a scanner judges a matching repo against. Every prescription below is
written as a **checkable rule** so a finding can name the exact clause.

## How to read a rule

Each rule has a stable ID (`R-<AREA>-<n>`), one checkable statement, the reason it exists,
and a note on how a scanner verifies it. IDs never change meaning across an edition — when
a rule is retired or its verdict flips, a new edition is cut.

!!! example "Rule shape"
    **R-AREA-n · Short imperative title**

    **Rule.** One sentence a scanner can evaluate to pass/fail.

    **Why.** The reason — usually tied to the static, no-server constraint.

    ```tsx
    // ✅ good   /  ❌ bad
    ```

    **vcqa.** The signal a scanner checks (a dep, a config key, a code pattern).

## The rubric

| # | Area | Code | What it governs |
| --- | --- | --- | --- |
| 1 | [Project setup](project-setup.md) | `SETUP` | Vite + React + pnpm workspace, scripts, node, relative base |
| 2 | [TypeScript](typescript.md) | `TS` | strict flags, project references, no `any`, typed boundaries |
| 3 | [Structure & routing](structure-and-routing.md) | `STRUCT` / `ROUTE` | folders, component boundaries, routing, code splitting, SPA fallback |
| 4 | [State & data](state-and-data.md) | `STATE` / `DATA` | local-first state, server-cache libs, external APIs, no own server |
| 5 | [Styling](styling.md) | `STYLE` | Tailwind v4 CSS-first, tokens, dark mode, no runtime CSS-in-JS |
| 6 | [Forms](forms.md) | `FORM` | controlled inputs, schema validation, accessible errors |
| 7 | [PWA & assets](pwa-and-assets.md) | `PWA` | service worker, caching, images, fonts, hashing |
| 8 | [Performance](performance.md) | `PERF` | bundle budgets, splitting, Core Web Vitals, render discipline |
| 9 | [Accessibility](accessibility.md) | `A11Y` | semantics, keyboard, focus, ARIA, contrast |
| 10 | [Testing](testing.md) | `TEST` | Vitest + Testing Library + Playwright, what to cover |
| 11 | [Build & hosting](build-and-hosting.md) | `BUILD` | static build, base, SPA fallback, cache headers, build-time env |
| 12 | [Security](security.md) | `SEC` | no secrets in bundle, CSP, auth via provider, dependency hygiene |

## Non-negotiables

The rules below are the ones that, if violated, mean the repo is either **broken as a
static SPA** or **not this archetype at all**. A scanner should weight these highest.

- **R-DATA-1** — no private secret (API key, token, DB credential) is present in client
  source or the built bundle. A static SPA ships its entire source to the browser.
- **R-BUILD-2** — assets load from a **relative** base so the app works under any path
  prefix / behind a proxy, not just the domain root.
- **R-BUILD-3** — the host serves `index.html` for unknown paths (**SPA fallback**), or
  the app uses hash routing; deep links must not 404.
- **R-ROUTE-1** — routing is client-side only; there is no server render step.
- **R-SETUP-1** — the app builds to static assets with `vite build` and needs **no**
  running server of its own to serve a request.
