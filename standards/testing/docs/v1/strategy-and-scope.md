# Strategy and scope

## R-STRAT-1 - Critical behavior is mapped to tests

**Rule.** Every repo slice must name its critical behavior and map each item to automated
tests or an explicit risk exception.

**Why.** A green test suite is meaningless when nobody knows which behavior it protects.
The map tells reviewers whether important flows are covered or merely hoped for.

**vcqa.** Flag repos with deployable code but no test strategy, no critical-flow list, and
no relationship between product/API/package behavior and test files.

**References.**

- Testing Library Guiding Principles:
  <https://testing-library.com/docs/guiding-principles>

## R-STRAT-2 - Test layers match the slice shape

**Rule.** Test layers must match what the slice ships: libraries need consumer/API
compatibility tests, CLIs need command/exit-code tests, APIs need boundary tests, and UI
apps need component plus smoke tests.

**Why.** A single test layer cannot prove every runtime. Unit-only coverage does not prove
deployment wiring, while E2E-only coverage gives slow, vague feedback for deterministic
logic bugs.

**vcqa.** Compare detected stack/slice signals with test directories, package scripts, and
workflow commands; flag missing expected layers for the slice type.

**References.**

- Vitest Guide: <https://vitest.dev/guide/>
- Playwright Best Practices: <https://playwright.dev/docs/best-practices>

## R-RISK-1 - Untested risk is explicit

**Rule.** Untested critical paths, manual-only checks, generated-code exclusions, and
temporarily deferred test layers must be documented with owner, reason, and review date.

**Why.** Hidden risk becomes permanent debt. Explicit risk lets a reviewer distinguish a
deliberate exception from a forgotten gap.

**vcqa.** Flag broad coverage/test exclusions or missing test layers without nearby
documentation naming reason, owner, or review trigger.

**References.**

- GitHub Actions deployments and environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>

