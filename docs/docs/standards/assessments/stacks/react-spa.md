# VCQA Independent Assessment: React SPA Stack Page

Date: 2026-07-25
Assessor: Independent AI Agent A
Target: `docs/docs/standards/stacks/react-spa.md`
Commit: `e47a3d44ed97f2b52d7a12a97387796564503ad6`

## Verdict

partial - The React SPA page is useful and backed by a substantial authored rubric, but it
should not yet be treated as a gold reference. The stack page clearly defines scope,
exclusions, composition, detection signals, and a reference repo. The underlying rubric
has many checkable `vcqa` signals. The main gaps are weak primary-source grounding, no
explicit severity model beyond non-negotiables, and reliance on a self-reported
`A 94/100` reference repo claim that was not independently proven here.

## Findings

- high: `docs/docs/standards/stacks/react-spa.md` - The page cites `ref-react-spa` as
  `A 94/100`, but this assessment did not inspect that repo, CI, or report evidence; the
  score should be treated as unverified.
- high: `standards/react-spa/docs/v1/index.md` and rule pages - The rubric claims
  gold-standard status, but the inspected pages do not expose a primary-source reference
  baseline comparable to D1.
- medium: `standards/react-spa/docs/v1/index.md` - Severity is implied by
  non-negotiables, but individual rules do not carry blocker/high/medium/low severity.
- medium: `standards/react-spa/docs/v1/*` - Exception handling is scattered or implicit;
  there is no central legacy/generated/vendor exception policy.
- medium: `standards/react-spa/docs/v1/styling.md` - Existing unresolved-link warnings
  reduce publication quality for this rubric.

## Scorecard

| Dimension | Score | Evidence |
|---|---:|---|
| Scope clarity | 9/10 | Stack page defines SPA-only scope and excludes SSR, Pages Functions APIs, and desktop shells. |
| Upstream grounding | 4/10 | Stack page links React/Vite starters, but rubric pages inspected do not show broad primary-source grounding. |
| VCQA-owned rules | 13/15 | Rules focus on static build, client env, SPA fallback, routing, CI, and deploy constraints. |
| Checkability | 12/15 | Many rules include `vcqa` scanner signals, though some styling/performance judgments are partly subjective. |
| Severity model | 5/10 | Non-negotiables exist, but rule-level severity is absent. |
| Exception policy | 5/10 | Some exceptions are mentioned, but no consistent exception policy exists across the rubric. |
| CI and evidence | 8/10 | Rubric names typecheck, unit, e2e, build, preview, and deploy evidence. |
| Anti-gaming posture | 7/10 | The rubric detects fake static compliance and missing gates, but lacks a dedicated anti-gaming section. |
| Maintenance lifecycle | 9/10 | Edition metadata includes targets, reviewed date, next review, status, and pin. |

Total: **72/100**

## Evidence Reviewed

- `docs/docs/standards/assessment.md`
- `docs/docs/standards/stacks/react-spa.md`
- `standards/react-spa/docs/v1/index.md`
- Nearby React SPA v1 rule pages via rule and `vcqa` signal search
- Git commit, branch, and origin metadata

## Claims Not Proven

- `ref-react-spa` is independently worth `94/100`.
- React SPA v1 is a gold standard rather than a strong partial rubric.
- All ecosystem-version claims are current and primary-source grounded.

## Required Fixes

- Add a primary-source reference baseline to React SPA v1.
- Add explicit severity to each rule or rule group.
- Add a central exception policy for legacy, generated, vendor, and host-constrained code.
- Resolve existing React SPA doc unresolved-link warnings.
- Mark reference repo scores as self-reported unless backed by a dated independent report.

## Useful Follow-ups

- Run a separate independent assessment of `vibecodeqa/ref-react-spa`.
- Add examples of failing patterns for the highest-risk rules.
- Publish a dated React SPA rubric assessment page.
