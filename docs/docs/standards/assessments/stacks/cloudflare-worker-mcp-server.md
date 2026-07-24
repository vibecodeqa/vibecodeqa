# VCQA Independent Assessment: Cloudflare Worker MCP Server Stack Page

Date: 2026-07-25
Assessor: Independent AI Agent B
Target scope: Stack page assessment only
Source target: [`docs/docs/standards/stacks/cloudflare-worker-mcp-server.md`](../../stacks/cloudflare-worker-mcp-server.md)
Live target: <https://vibecodeqa.online/docs/standards/stacks/cloudflare-worker-mcp-server/>
Published assessment URL: <https://vibecodeqa.online/docs/standards/assessments/stacks/cloudflare-worker-mcp-server/>
Commit: `e47a3d44ed97f2b52d7a12a97387796564503ad6`

## Verdict

good - Score: **86/100**. The page is useful and credible: it clearly defines the stack,
wrong-use cases, Worker/MCP security boundary, detection signals, and links to an authored
rubric with checkable rule IDs. It should not yet be treated as gold because the stack
page prominently cites a reference repo score and CI evidence without a dated independent
verification trail, and the linked rubric still lacks an explicit severity taxonomy.

## Findings

- medium: `docs/docs/standards/stacks/cloudflare-worker-mcp-server.md` - The page cites
  an `A 91/100` VCQA report for the reference repo, but this assessment did not verify
  that repo, its commit, or recent CI. Self-reported scores should be clearly labeled as
  input evidence, not an independent verdict.
- medium: `standards/cloudflare-worker-mcp-server/docs/v1/index.md` - The rubric has
  strong non-negotiables, but no explicit severity taxonomy such as
  blocker/high/medium/low/evidence-only.
- low: `docs/docs/standards/stacks/cloudflare-worker-mcp-server.md` - The page says
  remote mutating tools need rate limiting, but rate limiting is not visible in the rule
  highlights or sampled rubric rule pages.
- low: `docs/docs/standards/stacks/cloudflare-worker-mcp-server.md` - The reference
  implementation map is helpful, but the page does not include the exact reference repo
  commit assessed.

## Scorecard

| Dimension | Score | Evidence |
|---|---:|---|
| Scope clarity | 9/10 | Applicability and non-fit cases are clearly defined. |
| Upstream grounding | 9/10 | Cites Cloudflare, MCP, Zod, OWASP, and GitHub Actions primary references. |
| Composition mapping | 9/10 | Maps Cloudflare Workers, Durable Objects, MCP, Zod, TypeScript, Web Security, and GitHub Actions. |
| VCQA-owned rule surface | 14/15 | Focuses on Worker routing, auth-before-dispatch, tool schemas, state boundaries, audit, output safety, and CI evidence. |
| Checkability | 13/15 | Detection signals and sampled rubric pages define inspectable `vcqa` checks. |
| Severity and decision model | 7/10 | Decision matrix and non-negotiables are useful, but no explicit severity levels are defined. |
| CI and evidence claims | 8/10 | Maps files to evidence, but external CI/report claims were not independently verified here. |
| Exception and anti-gaming posture | 8/10 | Wrong-fit cases and anti-patterns are strong; exception handling is less formal than the criteria expect. |
| Maintenance lifecycle | 9/10 | Rubric index records reviewed date, next review, status, and pin format. |

Total: **86/100**

## Evidence Reviewed

- `docs/docs/standards/assessment.md`
- `docs/docs/standards/stacks/cloudflare-worker-mcp-server.md`
- `standards/cloudflare-worker-mcp-server/docs/v1/index.md`
- `authorization-and-permissions.md`
- `tool-schemas-and-validation.md`
- `state-storage-and-audit.md`
- `output-safety-and-observability.md`
- `deployment-gates.md`

## Claims Not Proven

- The linked `vibecodeqa/ref-cloudflare-worker-mcp` repository deserves `A 91/100`.
- The linked reference repo CI is currently green and exercises all evidence claimed by
  the stack page.
- External upstream URLs still match the exact semantics assumed by the local rubric.

## Required Fixes

- Add dated independent assessment links for the reference repo, including assessed commit
  and CI run.
- Add an explicit severity taxonomy to the authored rubric or link to a shared severity
  model.
- Either add rate-limiting/abuse-control rules or remove rate limiting from implied
  requirement language.

## Useful Follow-ups

- Add an evidence freshness block near the reference implementation section.
- Add an exception template for legacy SSE compatibility, non-OAuth internal
  service-token deployments, and no-state Workers.
