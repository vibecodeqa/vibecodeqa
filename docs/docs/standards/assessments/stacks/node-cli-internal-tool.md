# VCQA Independent Assessment: Node CLI Internal Tool Stack Page

Date: 2026-07-25
Assessor: Independent AI Agent C
Target scope: Stack page assessment only
Source target: [`docs/docs/standards/stacks/node-cli-internal-tool.md`](../../stacks/node-cli-internal-tool.md)
Live target: <https://vibecodeqa.online/docs/standards/stacks/node-cli-internal-tool/>
Published assessment URL: <https://vibecodeqa.online/docs/standards/assessments/stacks/node-cli-internal-tool/>
Commit: `e47a3d44ed97f2b52d7a12a97387796564503ad6`

## Verdict

draft - Score: **61/100**. This is a useful planned stack charter, but the published
score falls in the draft band. It identifies a real recurring stack shape and names the
right VCQA-owned risks: exit codes, stdout/stderr contracts, noninteractive operation,
credential boundaries, production safety, dry-run behavior, idempotency, runtime policy,
and SDK reuse. It is not yet a full rubric because it lacks severity levels, exception
policy, CI evidence requirements, maintenance lifecycle, and concrete evidence mapping to
an existing reference repo.

## Findings

- high: `docs/docs/standards/stacks/node-cli-internal-tool.md` - The page has candidate
  rules but no severity model.
- high: `docs/docs/standards/stacks/node-cli-internal-tool.md` - No exception policy is
  defined for legacy CLIs, generated clients, wrappers around vendor tools, or
  intentionally interactive admin commands.
- medium: `docs/docs/standards/stacks/node-cli-internal-tool.md` - CI and evidence
  expectations are implied but not explicit.
- medium: `docs/docs/standards/stacks/node-cli-internal-tool.md` - Benefits mention the
  Cloudflare SaaS example CLI and `vcqa/cli`, but the page does not link to concrete
  files or repos proving those surfaces.
- low: `docs/docs/standards/stacks/node-cli-internal-tool.md` - No edition, review date,
  target Node version, or authoring path is recorded.

## Scorecard

| Dimension | Score | Evidence |
|---|---:|---|
| Scope clarity | 9/10 | Scope and exclusions are clear: Node CLIs for developers, CI, operators, and automation. |
| Upstream grounding | 8/10 | References Node, npm, GitHub Actions, and OWASP secrets guidance; rule-level citation is missing. |
| VCQA-owned rules | 14/15 | Strong rule surface around process contracts, CI-safe output, credential lookup, production safety, idempotency, and SDK reuse. |
| Checkability | 12/15 | Most candidate rules are inspectable from code, config, docs, and CLI behavior. |
| Severity model | 2/10 | No blocker/high/medium/low model exists for candidate rules. |
| Exception policy | 2/10 | No documented exception route for legacy, generated, vendor-owned, or intentionally interactive cases. |
| CI and evidence | 5/10 | CI-facing concerns are discussed, but required checks and artifacts are not named as acceptance gates. |
| Anti-gaming posture | 7/10 | Anti-patterns cover fake success, stdout pollution, prompts in CI, secret leaks, and `--force` abuse. |
| Maintenance lifecycle | 2/10 | Planned status is clear, but no edition, target versions, review date, or next-review expectation appears. |

Total: **61/100**

## Evidence Reviewed

- `docs/docs/standards/assessment.md`
- `docs/docs/standards/stacks/node-cli-internal-tool.md`
- `docs/docs/standards/compositions.md`
- `docs/docs/standards/items/node.md`
- `docs/docs/standards/items/typescript.md`
- `standards/compositions.json`

## Claims Not Proven

- Cloudflare SaaS example CLI materially benefits from this charter.
- `vcqa/cli` currently has the risks listed by the charter.
- Candidate rules are backed by executable checks or scanner signals.
- All upstream claims are directly traceable to linked primary references.

## Required Fixes

- Add severity levels for each candidate rule.
- Add exception policy for legacy, generated, vendor-wrapped, and intentionally
  interactive commands.
- Add explicit CI/evidence requirements.
- Link benefits to concrete repo paths, ref repos, issues, or examples.
- Add edition/review metadata once promoted from charter to authored rubric.

## Useful Follow-ups

- Convert this charter into a versioned `standards/node-cli-internal-tool/docs/v1/`
  rubric.
- Use `ref-node-cli-internal-tool` as evidence, but assess it independently before citing
  it as canonical.
- Add failing-pattern examples for stdout misuse, fake JSON mode, missing credentials, and
  unsafe production writes.
