# Rule Contract

Every judgeable VCQA rule must declare the same decision contract: severity, evidence,
and exception handling. The prose can vary by stack, but a scanner or independent reviewer
must always be able to answer the same questions:

- how bad is the finding
- what evidence proves pass or fail
- what exception, if any, is acceptable
- when the exception expires or must be reviewed again

## Severity Taxonomy

| Severity | Meaning | Scoring semantics |
|---|---|---|
| `blocker` | The repo is unsafe to deploy, publish, or classify as this stack until fixed. | Failing one blocker caps the relevant rubric dimension at 50% and should cap the overall rubric verdict at `draft` unless the exception is explicitly accepted. |
| `high` | The repo can function, but the gap creates material security, data, release, compatibility, or user-impact risk. | High findings normally cap the relevant dimension at 70% until fixed or exception-reviewed. |
| `medium` | The repo has a meaningful maintainability, reliability, accessibility, test, or operability gap, but no immediate unsafe state. | Medium findings reduce the relevant dimension unless there is strong compensating evidence. |
| `low` | The repo misses a convention, polish expectation, or future-proofing rule with bounded impact. | Low findings should not dominate the score, but repeated low findings can show systemic weakness. |
| `evidence-only` | The rule asks for proof, artifact freshness, or traceability; absence is not itself the same as a behavior failure. | Evidence-only findings lower confidence and can escalate when they hide blocker/high behavior. |

Severity is assigned to a rule or rule group, not invented per reviewer. If severity
depends on context, the rule must define the escalation condition.

## Evidence Contract

Each rule or rule group must name the evidence a reviewer can inspect. Use the fields that
apply; do not force irrelevant artifacts.

```yaml
evidence:
  sourcePaths:
    - "src/**"
  configFiles:
    - "package.json"
    - ".github/workflows/*.yml"
  ciArtifacts:
    - "test logs"
    - "coverage report"
  deployedChecks:
    - "deployed URL smoke check"
  screenshotsOrTraces:
    - "Playwright trace for failing E2E flows"
  runtimeProof:
    - "CLI exit code and stdout/stderr transcript"
  negativeEvidence:
    - "no production secrets in bundled assets"
  exceptionFormat: "accepted-exception"
```

Evidence must be concrete enough to find in a repo, workflow run, deployed URL, report, or
runbook. "Has tests" is not evidence; `pnpm test --coverage` plus the workflow artifact is
evidence.

## Exception Template

An accepted exception must be narrow and reviewable. A comment such as "legacy code" is not
enough.

```yaml
acceptedException:
  owner: "<person, team, or role accountable for the exception>"
  scope: "<files, package, route, tenant, environment, or generated source boundary>"
  environmentOrTenant: "<prod|preview|local|tenant id|n/a>"
  reason: "<why the rule cannot be met now>"
  compensatingControls:
    - "<control that reduces the risk while the exception exists>"
  evidence:
    - "<link/path to issue, CI run, test, runbook, or approval record>"
  expiryOrReviewDate: "<YYYY-MM-DD>"
  approvalTrail:
    - "<approver, issue, ADR, change request, or security review>"
```

Exceptions cannot override archetype identity. For example, a React SPA that requires a
server to render HTML is not a `react-spa` with an exception; it is the wrong stack.

## Rule Template

```markdown
### R-AREA-1 - Short checkable title

**Severity.** high

**Rule.** One statement that can be judged from repo evidence.

**Why.** Why the rule matters for this stack shape.

**Evidence.**

- Source/config: `<paths or file classes>`
- CI/artifacts: `<commands, required checks, logs, traces, reports>`
- Runtime/deploy: `<URLs, smoke checks, package artifact, CLI transcript, etc.>`
- Exception: `acceptedException` with owner, scope, environment/tenant, reason,
  compensating controls, evidence, expiry/review date, and approval trail.

**vcqa.** Scanner or judge signal.

**References.**

- <upstream source>
```

## Anti-Gaming

Reviewers must escalate severity when evidence appears cosmetic:

- CI uploads artifacts that are never produced by failing tests.
- A workflow names a test command but uses `continue-on-error`, broad path ignores, or a
  non-required check.
- Exception records omit owner, scope, expiry, or approval trail.
- Screenshots/traces come from dev server behavior when the rule requires the built
  artifact.
- Generated tests assert only existence and do not exercise the risky behavior.
