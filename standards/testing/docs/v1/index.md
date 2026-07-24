# Testing - Edition v1

!!! info "Edition metadata"
    **Targets:** browser apps · APIs · Cloudflare Workers/Pages Functions · MCP · CLIs · SDKs · desktop apps · GitHub Actions
    **Reviewed:** 2026-07 · **Next review due:** 2027-07
    **Status:** latest · **Pin as:** `testing@v1`

This edition captures the cross-cutting testing baseline VibeCode QA applies across repo
slices. It focuses on checkable evidence that behavior is safe to change, then lets each
stack standard add its own runtime-specific test paths.

## Rule shape

Each rule has a stable ID (`R-<AREA>-<n>`), one checkable statement, the reason it exists,
a `vcqa` signal, and primary references.

## The rubric

| # | Area | Code | What it governs |
| --- | --- | --- | --- |
| 1 | [Strategy and scope](strategy-and-scope.md) | `STRAT` / `RISK` | test ownership, critical behavior inventory, risk exceptions |
| 2 | [Unit tests](unit-tests.md) | `UNIT` | deterministic logic, assertions, no tautology tests |
| 3 | [Integration tests](integration-tests.md) | `INT` / `BOUNDARY` | API, database, filesystem, package, provider, and protocol seams |
| 4 | [UI and component tests](ui-and-component-tests.md) | `UI` / `A11Y` | rendered behavior, accessible queries, states, interactions |
| 5 | [E2E smoke tests](e2e-smoke-tests.md) | `E2E` / `SMOKE` | built artifact, critical flows, deep links, deploy shape |
| 6 | [Coverage and risk](coverage-and-risk.md) | `COV` / `RISK` | coverage floors, exclusions, changed-code risk |
| 7 | [Mocks, fixtures, and snapshots](mocks-fixtures-and-snapshots.md) | `MOCK` / `FIXTURE` / `SNAP` | mock boundaries, realistic fixtures, snapshot discipline |
| 8 | [CI and evidence](ci-and-evidence.md) | `CI` / `EVIDENCE` | test commands, required checks, artifacts, failure records |
| 9 | [Flaky, skipped, and generated tests](flaky-skipped-and-generated-tests.md) | `FLAKE` / `SKIP` / `GEN` | quarantine policy, skipped tests, AI-generated tests |

## Non-negotiables

- **R-CI-1** - deploy, release, and publish workflows run the required tests before
  mutating production, package registries, or release assets.
- **R-STRAT-1** - critical behavior is named and mapped to automated tests or documented
  risk exceptions.
- **R-UNIT-1** - deterministic logic has meaningful assertions over outputs or effects,
  not only existence checks.
- **R-INT-1** - external boundaries are tested at the boundary they expose, not only by
  mocking away the integration code.
- **R-E2E-1** - deployable apps have at least one built-artifact smoke test for the most
  important user or operator path.
- **R-COV-1** - coverage thresholds exist for code that carries behavior, and exclusions
  are explicit.
- **R-MOCK-1** - mocks do not replace the behavior under test.
- **R-SKIP-1** - skipped, flaky, or quarantined tests have an owner and reason.
- **R-GEN-1** - generated or AI-authored tests are held to the same assertion quality as
  human-authored tests.

## Reference baseline

- Vitest Guide: <https://vitest.dev/guide/>
- Playwright Best Practices: <https://playwright.dev/docs/best-practices>
- Testing Library Guiding Principles:
  <https://testing-library.com/docs/guiding-principles>
- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>
- GitHub Actions deployments and environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>

