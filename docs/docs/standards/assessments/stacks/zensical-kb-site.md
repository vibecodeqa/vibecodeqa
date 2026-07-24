# VCQA Independent Assessment: Zensical KB Site Stack Page

Date: 2026-07-25
Assessor: Independent AI Agent D
Target scope: Stack page assessment only
Source target: [`docs/docs/standards/stacks/zensical-kb-site.md`](../../stacks/zensical-kb-site.md)
Live target: <https://vibecodeqa.online/docs/standards/stacks/zensical-kb-site/>
Published assessment URL: <https://vibecodeqa.online/docs/standards/assessments/stacks/zensical-kb-site/>
Commit: `e47a3d44ed97f2b52d7a12a97387796564503ad6`

## Verdict

partial - This is the strongest of Agent D's three charters. It has a narrow scope,
relevant exclusions, credible detection signals, and VCQA-specific concerns around
Markdown source, generated output, stable URLs, registry references, and docs drift. It
still needs a real rubric before it can judge repos consistently.

## Findings

- medium: `docs/docs/standards/stacks/zensical-kb-site.md` - No full rubric exists, so
  scoring and enforcement remain undefined.
- medium: `docs/docs/standards/stacks/zensical-kb-site.md` - Rule surface is useful but
  lacks concrete pass/fail checks for ignored generated output, URL stability, reference
  provenance, and drift.
- medium: `docs/docs/standards/stacks/zensical-kb-site.md` - Detection signals are
  plausible but should include nav config, broken-link checks, generated `site/` policy,
  and deploy workflow artifacts.
- low: `docs/docs/standards/stacks/zensical-kb-site.md` - Benefits list three VCQA
  surfaces, but this review did not verify their CI/deploy behavior.

## Scorecard

| Dimension | Score | Evidence |
|---|---:|---|
| Scope and exclusions | 14/15 | Scope is narrow and exclusions are useful. |
| Composition grounding | 13/15 | Docs KB and GitHub Actions are the right core items. |
| VCQA-owned rule surface | 15/20 | Strong VCQA-specific surface: source of truth, generated output, stable URLs, drift. |
| Detection and checkability | 12/15 | `zensical.toml`, Markdown tree, and deploy workflow are scanner-visible. |
| Evidence and claim backing | 7/10 | Docs KB item cites Zensical, Diataxis, ADR, and C4; stack page itself is sparse. |
| CI/evidence expectations | 5/10 | Build/deploy workflow is named, but exact gates/artifacts are missing. |
| Exceptions and anti-gaming | 3/10 | Generated-site risk is named, but no anti-gaming policy is written. |
| Maintenance readiness | 2/5 | Planned status is clear; no review lifecycle. |

Total: **71/100**

## Evidence Reviewed

- `docs/docs/standards/assessment.md`
- `docs/docs/standards/stacks/zensical-kb-site.md`
- `docs/docs/standards/items/docs-kb.md`
- `docs/docs/standards/items/github-actions.md`

## Claims Not Proven

- `vibecodeqa/docs`, `vibecodeqa/standards`, and the Cloudflare SaaS example docs all
  satisfy the stated source/build separation.
- Published URLs are stable in current deployments.
- Docs drift checks exist where mirrors exist.

## Required Fixes

- Define required CI gates: Zensical build, link check, nav check, generated-output
  cleanliness, and deploy target evidence.
- Define exception policy for generated docs, vendored references, archived docs, and
  deliberately unpublished internal notes.
- Add concrete examples of failing patterns: committed `site/`, guessed URLs, stale
  registry links, and unreferenced standards pages.

## Useful Follow-ups

- Create `ref-zensical-kb-site`.
- Promote this stack ahead of VS Code/Tauri if VCQA wants a near-term rubric with strong
  self-assessment value.
