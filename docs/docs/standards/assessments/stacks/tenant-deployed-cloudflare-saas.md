# VCQA Independent Assessment: Tenant-Deployed Cloudflare SaaS Stack Page

Date: 2026-07-25
Assessor: Independent AI Agent B
Target: `docs/docs/standards/stacks/tenant-deployed-cloudflare-saas.md`
Commit: `e47a3d44ed97f2b52d7a12a97387796564503ad6`

## Verdict

good - Score: **89/100**. This is a strong stack page. It explains why
tenant-deployed Cloudflare SaaS exists, what it excludes, which variants it covers, how
the reference repo is illustrative rather than normative, and which operational controls
VCQA owns. It falls short of gold mainly because the cited reference score and CI evidence
were not independently verified in-page, and the linked rubric needs an explicit severity
model.

## Findings

- medium: `docs/docs/standards/stacks/tenant-deployed-cloudflare-saas.md` - The page
  cites `A 91/100` for `ref-cloudflare-saas`, but this assessment did not verify that
  repo, its commit, or GitHub Actions status.
- medium: `standards/tenant-deployed-cloudflare-saas/docs/v1/index.md` - The rubric lists
  non-negotiables but does not define blocker/high/medium/low severity mapping.
- low: `docs/docs/standards/stacks/tenant-deployed-cloudflare-saas.md` - The reference
  template map points to floating `main` URLs rather than assessed commits.
- low: `docs/docs/standards/stacks/tenant-deployed-cloudflare-saas.md` - Non-D1
  data-resource backup/restore expectations may need one more explicit rule or example.

## Scorecard

| Dimension | Score | Evidence |
|---|---:|---|
| Scope clarity | 10/10 | Covered variants, scope, and exclusions are clearly defined. |
| Upstream grounding | 9/10 | Cites relevant Cloudflare, GitHub Actions, and OWASP primary references. |
| Composition mapping | 9/10 | Maps Workers, GitHub Actions, Web Security, Docs KB, Pages Functions, D1, and Worker MCP composition. |
| VCQA-owned rule surface | 14/15 | Focuses on tenant isolation, promotion, previews, secrets, rollback, observability, and audit. |
| Checkability | 14/15 | Scanner signals and sampled rule pages provide inspectable checks. |
| Severity and decision model | 7/10 | Decision matrix and non-negotiables are strong, but severity mapping is absent. |
| CI and evidence claims | 8/10 | Maps reference files to evidence, but CI/report claims were not independently verified. |
| Exception and anti-gaming posture | 9/10 | Wrong-fit cases and common anti-patterns are directly addressed. |
| Maintenance lifecycle | 9/10 | Rubric index records reviewed date, next review, status, and pin format. |

Total: **89/100**

## Evidence Reviewed

- `docs/docs/standards/assessment.md`
- `docs/docs/standards/stacks/tenant-deployed-cloudflare-saas.md`
- `standards/tenant-deployed-cloudflare-saas/docs/v1/index.md`
- `tenant-resources.md`
- `environments-secrets-and-bindings.md`
- `preview-access-and-aliases.md`
- `promotion-data-and-rollbacks.md`
- `observability-and-audit.md`
- Confirmed `standards/cloudflare-d1-app` exists locally for the D1 composition claim.

## Claims Not Proven

- The linked `vibecodeqa/ref-cloudflare-saas` repository deserves `A 91/100`.
- The linked reference repo CI is currently green and exercises all mapped evidence.
- Non-D1 data-resource backup/restore equivalence is fully represented by authored rubric
  detail.
- External upstream URLs still match the exact semantics assumed by the local rubric.

## Required Fixes

- Add dated independent assessment links for `ref-cloudflare-saas`, including assessed
  commit and CI run.
- Add explicit severity mapping for the tenant SaaS rubric.
- Pin reference-template evidence links to a commit or publish a dated evidence snapshot.

## Useful Follow-ups

- Add one short non-D1 example for R2/KV/Durable Object tenant data-resource backup,
  restore, or compatibility evidence.
- Add a compact minimum viable tenant deployment evidence checklist separate from the rich
  reference repo map.
