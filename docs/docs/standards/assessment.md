# Assessment Criteria

This page defines how VibeCode QA assesses its own standards and reference
implementations. It exists so a separate reviewer, including an independent AI agent, can
produce a report on VCQA without relying on the claims written inside the rubric or repo
being assessed.

The assessor must judge evidence, not intent. A rubric or reference repo can be useful
without being perfect, but the report must say exactly where it is authoritative, where it
is only illustrative, and where it should not yet be treated as a gold standard.

## Assessment Targets

Assess these targets separately:

- **Rubric:** a versioned standard under `/standards/<id>/vN/`.
- **Reference repo:** a public `vibecodeqa/ref-*` repository.
- **Composition:** a documented relationship between a rubric, stack items, scanner
  signals, and one or more reference repos.
- **VCQA itself:** the standards catalog, published rubrics, reference repos, scanner
  behavior, docs, CI, issue trail, and claims made on the website.

Do not combine the scores into one number until each target has its own evidence table.

## Scoring Bands

Use a 100-point score only after the written findings are complete.

| Band | Meaning |
|---:|---|
| 95-100 | Gold reference. Strong enough to cite as the canonical VCQA example. |
| 85-94 | Good reference. Useful and credible, with known bounded gaps. |
| 70-84 | Partial reference. Valuable as a fixture, but not enough to define best practice. |
| 50-69 | Draft. Shows direction, but key evidence or behavior is missing. |
| 0-49 | Not reliable. Claims are materially unsupported or misleading. |

Scores must be conservative. Passing CI is evidence, not a score by itself.

## Rubric Quality Scorecard

Assess each rubric across these dimensions.

| Dimension | Weight | What Good Looks Like |
|---|---:|---|
| Scope clarity | 10 | The rubric says what it governs, what it excludes, and which repo slices it applies to. |
| Upstream grounding | 10 | Broad doctrine is cited to primary sources instead of rewritten from memory. |
| VCQA-owned rules | 15 | Rules focus on stack-specific glue, deployment/runtime seams, and scanner-visible risks. |
| Checkability | 15 | Each rule can be judged from code, config, CI, deploy evidence, or explicit exceptions. |
| Severity model | 10 | Findings imply clear impact: blocker, high, medium, low, or evidence-only. |
| Exception policy | 10 | Acceptable exceptions are narrow, documented, reviewable, and not loopholes. |
| CI and evidence | 10 | Required checks and artifacts are named, not vaguely recommended. |
| Anti-gaming posture | 10 | The rubric detects hollow compliance, fake tests, dead config, and generated evidence churn. |
| Maintenance lifecycle | 10 | Edition, review date, target versions, and next-review expectations are clear. |

### Rubric Failure Modes

Flag these even if the page reads well:

- generic framework advice with no VCQA-specific judgment
- rules that cannot be checked from repository evidence
- missing distinction between recommendation and requirement
- no source citations for ecosystem claims
- no exception path for legacy, generated, or vendor-owned code
- no CI/evidence expectation
- no examples of failing patterns
- scoring language that encourages cosmetic compliance

## Reference Repo Quality Scorecard

Assess each `ref-*` repository across these dimensions.

| Dimension | Weight | What Good Looks Like |
|---|---:|---|
| Stack representativeness | 10 | The repo matches a real recurring stack shape VCQA wants to judge. |
| Minimal completeness | 10 | It is small, but includes every important surface for that stack. |
| Behavioral correctness | 15 | The app/tool/package does something real enough to test meaningful behavior. |
| Standards evidence | 15 | README and report map concrete files to authored rubrics and known gaps. |
| CI quality | 15 | CI runs typecheck, tests, build, and stack-specific smoke or emulator checks. |
| Security and secrets | 10 | Secret handling, environment separation, auth boundaries, and permissions are explicit. |
| Operational evidence | 10 | Runbooks cover local dev, deploy, rollback/fix-forward, and production caveats. |
| Scanner usefulness | 10 | The repo exposes signals VCQA can detect and regress against over time. |
| Maintainability | 5 | Dependencies, generated outputs, and scripts are simple enough to keep current. |

### Reference Repo Failure Modes

Flag these even if CI passes:

- toy code that does not exercise the risky stack boundaries
- mocked behavior that hides the actual integration being demonstrated
- docs claiming a high score without evidence
- no negative tests for safety or security behavior
- generated output committed without a clear reason
- secrets, real project IDs, or production credentials in examples
- CI that only installs or builds without testing the important stack seam
- a reference repo that duplicates a vendor starter without VCQA-owned additions

## Independent Agent Protocol

An independent AI agent assessing VCQA must follow this protocol.

1. Identify the target and assessment date.
2. Record the exact commit SHA, branch, and repository URL.
3. Read the relevant rubric, docs page, `README.md`, CI workflow, tests, and report file.
4. Run available local checks when practical.
5. Inspect recent GitHub Actions runs when the repo is public.
6. Compare claims to evidence file by file.
7. Produce findings before scores.
8. Score each dimension with a one-sentence justification.
9. List blocking gaps separately from ordinary improvements.
10. State whether the target is gold, good, partial, draft, or unreliable.

The agent must not accept self-reported scores at face value. Existing
`docs/vcqa-report.md` files are inputs to review, not authoritative verdicts.

## Required Report Format

Every independent assessment report should use this structure:

```text
# VCQA Independent Assessment: <target>

Date: <YYYY-MM-DD>
Assessor: <agent/model or reviewer>
Target: <repo/rubric URL>
Commit: <sha or published edition>

## Verdict
<gold|good|partial|draft|unreliable> — <one paragraph>

## Findings
- <severity>: <file or URL> — <issue and impact>

## Scorecard
| Dimension | Score | Evidence |
|---|---:|---|

## Evidence Reviewed
- <files, workflows, docs, commands, CI runs>

## Claims Not Proven
- <claim>

## Required Fixes
- <fix>

## Useful Follow-ups
- <follow-up>
```

## VCQA Self-Assessment Scope

When reporting on VCQA itself, include these targets:

- standards catalog and registry consistency
- every authored rubric
- every public `ref-*` repo
- the CLI scanner behavior and report output
- GitHub Actions status for docs, standards, CLI, and reference repos
- whether docs, standards, and marketing pages make claims the evidence supports

The result should be published as a dated report, not as an evergreen badge. A current
report can link to older reports so regressions and improvements are visible.

## Anti-Gaming Rules

The assessment must penalize:

- changing wording to evade scanner checks without improving behavior
- deleting tests, docs, or examples to reduce findings
- marking generated or vendor code as owned source without a clear policy
- adding fake smoke tests that do not execute the built artifact
- claiming coverage from a broader standard when the relevant slice is not actually
  represented
- using a reference repo as proof for a different stack shape

The point of self-assessment is to make VCQA more trustworthy, not to manufacture a high
score.

