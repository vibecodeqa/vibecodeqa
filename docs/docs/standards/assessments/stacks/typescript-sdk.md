# VCQA Independent Assessment: TypeScript SDK Stack Page

Date: 2026-07-25
Assessor: Independent AI Agent C
Target: `docs/docs/standards/stacks/typescript-sdk.md`
Commit: `e47a3d44ed97f2b52d7a12a97387796564503ad6`

## Verdict

partial - This is a strong planned charter and probably the most mature of the three pages
Agent C assessed. It identifies the right SDK-specific contract risks: export maps,
declaration/runtime alignment, generated client drift, runtime validation, typed errors,
credential boundaries, consumer fixture tests, SemVer, and reproducible publish artifacts.
It is still not a full rubric because it lacks severity, exception handling, concrete CI
artifacts, maintenance metadata, and direct proof for benefit claims.

## Findings

- high: `docs/docs/standards/stacks/typescript-sdk.md` - The page defines good candidate
  rules but no severity model.
- high: `docs/docs/standards/stacks/typescript-sdk.md` - No exception policy covers
  generated SDK clients, unstable internal packages, private preview APIs, dual package
  constraints, or intentionally unsupported runtimes.
- medium: `docs/docs/standards/stacks/typescript-sdk.md` - CI requirements are described
  inside candidate rules but not consolidated into required evidence gates.
- medium: `docs/docs/standards/stacks/typescript-sdk.md` - Benefits mention Cloudflare
  SaaS example SDK and future VCQA schema/client packages without direct evidence links.
- low: `docs/docs/standards/stacks/typescript-sdk.md` - No edition, target
  TypeScript/Node versions, review date, or next-review policy is recorded.

## Scorecard

| Dimension | Score | Evidence |
|---|---:|---|
| Scope clarity | 9/10 | Scope and exclusions are clear: TypeScript packages consumed as SDKs/client libraries. |
| Upstream grounding | 9/10 | References TypeScript, Node packages, npm metadata, trusted publishing, OpenAPI, JSON Schema, SemVer, and OWASP secrets. |
| VCQA-owned rules | 14/15 | Strong surface around packaging contracts, declaration/runtime fit, generated drift, typed failures, validation, credentials, and provenance. |
| Checkability | 13/15 | Candidate rules are mostly checkable through package metadata, tarball tests, declarations, generated diffs, runtime fixtures, and docs. |
| Severity model | 2/10 | No severity model exists. |
| Exception policy | 2/10 | No documented exception path for generated code, preview APIs, private packages, legacy module formats, or runtime-specific exports. |
| CI and evidence | 6/10 | Consumer fixture tests, pack/link tests, declaration checks, and generated drift checks are named but not checklist requirements. |
| Anti-gaming posture | 8/10 | Anti-patterns address stale declarations, unsupported deep imports, untested dual modules, generated clients, untyped errors, and unsafe credentials. |
| Maintenance lifecycle | 2/10 | Planned status is clear, but edition, target versions, review cadence, and update triggers are missing. |

Total: **65/100**

## Evidence Reviewed

- `docs/docs/standards/assessment.md`
- `docs/docs/standards/stacks/typescript-sdk.md`
- `docs/docs/standards/compositions.md`
- `docs/docs/standards/items/typescript.md`
- `standards/compositions.json`

## Claims Not Proven

- Cloudflare SaaS example SDK exists in a form that demonstrates this charter.
- Future VCQA schema/client packages need this exact stack charter.
- Generated client drift can already be detected by VCQA.
- Consumer compatibility tests are implemented anywhere today.

## Required Fixes

- Add severity levels to each candidate rule.
- Add exception policy for generated clients, preview APIs, private SDKs, unsupported
  runtimes, and migration periods.
- Define required CI evidence: packed artifact test, declaration compile fixture,
  import/require or ESM-only fixture, generated drift check, runtime validation tests, and
  secret-redaction checks.
- Link claimed benefits to concrete examples or issues.
- Add edition/review metadata before publishing as a full rubric.

## Useful Follow-ups

- Create and independently assess `ref-typescript-sdk` before using it as canonical
  evidence.
- Add a sample package contract matrix covering `exports`, `types`, `files`, runtime
  targets, and supported TypeScript versions.
- Add failing-pattern examples for stale declarations, untested dual packages, broad
  ambient credential lookup, and string-only errors.
