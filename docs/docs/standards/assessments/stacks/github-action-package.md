# VCQA Independent Assessment: GitHub Action Package Stack Page

Date: 2026-07-25
Assessor: Independent AI Agent C
Target scope: Stack page assessment only
Source target: [`docs/docs/standards/stacks/github-action-package.md`](../../stacks/github-action-package.md)
Live target: <https://vibecodeqa.online/docs/standards/stacks/github-action-package/>
Published assessment URL: <https://vibecodeqa.online/docs/standards/assessments/stacks/github-action-package/>
Commit: `e47a3d44ed97f2b52d7a12a97387796564503ad6`

## Verdict

unreliable - Score: **25/100**. This page identifies a valid planned stack, but the
published score falls in the unreliable band because it is too thin to be a useful
assessment charter yet. It names the basic surface area: `action.yml`, minimum
permissions, input validation, runtime/dependency policy, and release tags. It lacks
teaching focus, upstream references on the stack page, candidate rules, anti-patterns,
severity, exceptions, evidence requirements, maintenance metadata, and proof for the
`vibecodeqa/action` benefit claim.

## Findings

- high: `docs/docs/standards/stacks/github-action-package.md` - No candidate rules are
  listed, so assessors cannot determine compliant or noncompliant action package behavior.
- high: `docs/docs/standards/stacks/github-action-package.md` - No severity model,
  exception policy, or CI/evidence requirements exist.
- high: `docs/docs/standards/stacks/github-action-package.md` - The stack page has no
  upstream references section, even though the related item page links GitHub metadata,
  action creation, and secure-use references.
- medium: `docs/docs/standards/stacks/github-action-package.md` - Detection signals are
  minimal and omit important inspectable signals such as `runs.using`, `inputs`,
  `outputs`, permissions in examples, `dist` artifacts, release tags, dependency
  lockfiles, and workflow consumers.

## Scorecard

| Dimension | Score | Evidence |
|---|---:|---|
| Scope clarity | 7/10 | Scope and exclusions are present, but JavaScript, composite, and Docker action expectations are not distinguished. |
| Upstream grounding | 3/10 | The stack page has no upstream references; relevant references exist only on the item page. |
| VCQA-owned rules | 6/15 | The rule surface names metadata, permissions, input validation, runtime policy, and release tags, but lacks candidate rules. |
| Checkability | 5/15 | `action.yml` and workflow examples are checkable, but explicit checks are missing. |
| Severity model | 0/10 | No severity model exists. |
| Exception policy | 0/10 | No exception policy exists for composite actions, Docker actions, generated `dist`, private/internal actions, or trusted same-repo usage. |
| CI and evidence | 2/10 | CI is implied by the stack but no required evidence or workflow checks are named. |
| Anti-gaming posture | 1/10 | No anti-patterns or anti-gaming language appear on the stack page. |
| Maintenance lifecycle | 1/10 | Planned status is clear, but no edition, target runtime, review date, or release review policy is recorded. |

Total: **25/100**

## Evidence Reviewed

- `docs/docs/standards/assessment.md`
- `docs/docs/standards/stacks/github-action-package.md`
- `docs/docs/standards/compositions.md`
- `docs/docs/standards/items/github-action.md`
- `docs/docs/standards/items/node.md`
- `docs/docs/standards/items/typescript.md`
- `standards/compositions.json`

## Claims Not Proven

- `vibecodeqa/action` exists and benefits from this planned standard.
- Minimum token permissions are defined for example workflows.
- Input validation expectations are enforceable.
- Runtime and dependency policy is pinned.
- Release tag policy makes consumer pinning reliable.

## Required Fixes

- Add upstream references directly to the stack page or clearly inherit them from the item
  page.
- Add a teaching focus.
- Add candidate rules for metadata, inputs/outputs, permissions, dependency pinning,
  built artifact policy, release tags, examples, and consumer pinning.
- Add severity levels, exception policy, CI/evidence requirements, anti-patterns, and
  lifecycle metadata.
- Link the `vibecodeqa/action` benefit claim to concrete evidence.

## Useful Follow-ups

- Create a `ref-github-action-package` only after this charter is expanded enough to define
  what the repo should prove.
- Include separate expectations for JavaScript, composite, and Docker actions.
- Add checks for `GITHUB_TOKEN` permissions in README examples and workflow examples.
