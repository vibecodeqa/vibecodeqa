# react-spa

The **gold-standard reference** for the `react-spa` archetype — React apps that are
**client-rendered and hosted as static files** (no SSR, no server of their own; data via
external APIs or a platform SDK).

Published by [FreeDocStore](https://github.com/FreeDocStore) at
**<https://react-spa.freedocstore.online/>**.

## What this is

This repo is a rubric, not a tutorial. [VibeCode QA](https://vibecodeqa.online) detects a
repo's archetype, loads the matching standard, and scores the code against its rules.
Findings reference clause IDs (`R-SETUP-6`, `R-DATA-1`, …) that map straight back to these
pages.

It is one of a family of per-archetype standards (`react-spa`, `react-ssr`, `vue-spa`,
`node-service`, `flutter-app`, …). The boundary of each is **framework × runtime shape** —
the combination that changes what "good" looks like and is auto-detectable. Choices *within*
a standard (Vite, Tailwind, Vitest) are prescriptions, not the boundary.

## Editions

Editions are **versioned on change**, not dated — a new edition is cut only when best
practice materially shifts (a React/Vite/Tailwind major, a new consensus). Each edition
carries a **review date** so it can't silently rot.

| Edition | Targets | Reviewed | Next review due | Status |
| --- | --- | --- | --- | --- |
| `v1` | React 19 · Vite 8 · Tailwind 4 · TS 6 | 2026-07 | 2027-07 | latest |

`react-spa.freedocstore.online/latest` redirects to the current edition.

## Structure

```
docs/
├─ index.md          # overview: what the archetype is, when it applies
└─ v1/               # edition v1
   ├─ index.md       # edition metadata + rubric map + non-negotiables
   └─ *.md           # one page per rubric area (SETUP, TS, STRUCT/ROUTE, …)
```

## Publishing

Content is Markdown in `docs/`; [Zensical](https://zensical.org) builds the static site,
and the `Deploy` workflow publishes to Cloudflare Pages (project `react-spa`) and attaches
the custom domain on every push to `main`. Manual edits happen in GitHub.

## Contributing an edition review

1. Re-verify every rule against the current ecosystem.
2. If nothing material changed, bump `Reviewed:` on the edition front page.
3. If it did, copy `docs/v1/` → `docs/v2/`, revise, and move `latest`.
