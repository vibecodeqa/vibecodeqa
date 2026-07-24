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

**Rule.** CI must preserve useful evidence for failed E2E, integration, visual, desktop,
or provider-bound tests where failures cannot be diagnosed from logs alone.

**Why.** Screenshots, traces, videos, coverage reports, and logs turn intermittent or
environment-specific failures into actionable debugging data.

**vcqa.** Flag Playwright or equivalent E2E workflows with no artifact upload for traces,
screenshots, videos, coverage, or failure reports.

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

