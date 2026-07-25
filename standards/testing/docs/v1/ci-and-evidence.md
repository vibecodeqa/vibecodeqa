# CI and evidence

## R-CI-1 - Tests run before deploy, release, or publish

**Rule.** Any workflow that deploys, releases, publishes, migrates, or mutates production
must run the required tests first or depend on a completed required test workflow.

**Why.** Tests that run after production mutation are monitoring, not a gate.

**vcqa.** Flag deploy/publish/release workflows that lack test steps, skip test
dependencies, or run from branches without a required check.

**References.**

- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>

## R-CI-2 - CI records useful failure evidence

**Severity.** `medium`, escalating to `high` when the missing artifact blocks diagnosis of
a deploy, release, security, data, tenant, or package-boundary failure.

**Rule.** CI must preserve useful evidence for failed E2E, integration, visual, desktop,
or provider-bound tests where failures cannot be diagnosed from logs alone.

**Why.** Screenshots, traces, videos, coverage reports, and logs turn intermittent or
environment-specific failures into actionable debugging data.

**vcqa.** Flag Playwright or equivalent E2E workflows with no artifact upload for traces,
screenshots, videos, coverage, or failure reports.

**Evidence.**

- Source/config: workflow files and test runner config.
- CI/artifacts: failed-run logs plus uploaded traces, screenshots, videos, coverage, or
  structured failure reports.
- Runtime/deploy: built-artifact smoke command or deployed URL when the failing check is
  runtime-specific.
- Exception: accepted only for deterministic unit tests or checks whose full failure state
  is visible in logs; the exception must include owner, scope, reason, compensating
  controls, evidence, expiry/review date, and approval trail.

**References.**

- Playwright Best Practices: <https://playwright.dev/docs/best-practices>

## R-EVIDENCE-1 - Test commands are discoverable

**Rule.** A maintainer must be able to find the local and CI test commands from
`package.json`, workflow files, or repo docs.

**Why.** Hidden test commands make failures hard to reproduce and encourage laptop-only
knowledge.

**vcqa.** Flag repos with test files but no package script, workflow command, README, or
runbook describing how to run them.

**References.**

- Vitest Guide: <https://vitest.dev/guide/>
