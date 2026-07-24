# VCQA Independent Assessment: Cloudflare Pages Fullstack Stack Page

Date: 2026-07-25
Assessor: Independent AI Agent A
Target: `docs/docs/standards/stacks/cloudflare-pages-fullstack.md`
Commit: `e47a3d44ed97f2b52d7a12a97387796564503ad6`

## Verdict

partial - The page identifies a real and valuable stack seam: static frontend plus
same-origin Pages Functions. The authored rubric is concise and mostly checkable. It is
not yet a strong canonical reference because it lacks a dedicated reference
implementation, has limited upstream citations in the inspected rubric pages, and does
not define explicit severity or exception handling.

## Findings

- high: `docs/docs/standards/stacks/cloudflare-pages-fullstack.md` - No reference
  implementation is listed, while the standards overview still lists
  `ref-cloudflare-pages-fullstack` as a future candidate.
- high: `standards/cloudflare-pages-fullstack/docs/v1/*` - Rules cover
  Cloudflare-specific behavior, but inspected pages do not cite primary Cloudflare or
  GitHub Actions sources.
- medium: `standards/cloudflare-pages-fullstack/docs/v1/index.md` - Non-negotiables are
  useful, but there is no rule-level severity model.
- medium: `standards/cloudflare-pages-fullstack/docs/v1/*` - Exception handling is
  incomplete; phrases like documented equivalent appear without a standard review path.
- medium: `docs/docs/standards/stacks/cloudflare-pages-fullstack.md` - The page's
  benefits are plausible but broad and not tied to a current reference repo or assessment
  report.

## Scorecard

| Dimension | Score | Evidence |
|---|---:|---|
| Scope clarity | 9/10 | Page clearly scopes static frontend plus Pages Functions and excludes Workers-only, D1-specific, and generic React doctrine. |
| Upstream grounding | 4/10 | Rubric lacks visible primary-source citations in inspected rule pages. |
| VCQA-owned rules | 13/15 | Strong focus on `/api/*` seam, middleware auth, bindings, deploy assembly, and preview isolation. |
| Checkability | 12/15 | Rules have `vcqa` signals for workflows, route trees, bindings, env vars, and tests. |
| Severity model | 5/10 | Non-negotiables exist but no blocker/high/medium/low mapping. |
| Exception policy | 5/10 | Some local allowances exist, but no central exception policy. |
| CI and evidence | 8/10 | CI/deploy rules name build, type checks, permissions, deployed URL, and smoke checks. |
| Anti-gaming posture | 7/10 | Catches client-only auth, secret-like `VITE_*`, route collisions, and deploy mismatch; no explicit anti-gaming section. |
| Maintenance lifecycle | 9/10 | Edition metadata has targets, reviewed date, next review, status, and pin. |

Total: **72/100**

## Evidence Reviewed

- `docs/docs/standards/assessment.md`
- `docs/docs/standards/stacks/cloudflare-pages-fullstack.md`
- `standards/cloudflare-pages-fullstack/docs/v1/index.md`
- Rule pages for routing, auth/security, env/bindings, typing, deployment, testing
- `docs/docs/standards/index.md`
- `docs/docs/standards/compositions.md`
- Git commit, branch, and origin metadata

## Claims Not Proven

- VCQA has a working minimal Pages Fullstack reference repo.
- Preview smoke testing guidance is proven against a real fixture.
- The Cloudflare-specific rules are fully aligned to current Cloudflare docs.

## Required Fixes

- Create and assess `ref-cloudflare-pages-fullstack`.
- Add primary-source references to the rubric.
- Add explicit severity bands per rule or rule group.
- Add a consistent exception policy.
- Tie benefits to concrete repos, reports, or known product surfaces.

## Useful Follow-ups

- Add failing examples for route collision, leaked `VITE_*` secrets, and preview/prod
  binding reuse.
- Add a machine-readable rule index with severity and check category.
