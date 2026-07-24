# Flaky, skipped, and generated tests

## R-SKIP-1 - Skipped tests have owner and reason

**Rule.** Skipped, todo, quarantined, or disabled tests must include a reason, owner, and
review trigger.

**Why.** Skips without accountability become permanent blind spots while the test suite
still reports green.

**vcqa.** Flag `.skip`, `.todo`, quarantine lists, disabled specs, or excluded test paths
without nearby owner/reason metadata.

**References.**

- Vitest Guide: <https://vitest.dev/guide/>
- Playwright Best Practices: <https://playwright.dev/docs/best-practices>

## R-FLAKE-1 - Flakes are fixed or quarantined explicitly

**Rule.** Flaky tests must be fixed promptly or quarantined with a bounded policy; retries
alone are not a fix.

**Why.** Flakes teach teams to ignore CI and can hide real regressions behind retry noise.

**vcqa.** Flag high retry counts, repeated failure annotations, or flaky-test comments with
no linked issue, owner, or expiry.

**References.**

- Playwright Best Practices: <https://playwright.dev/docs/best-practices>

## R-GEN-1 - Generated tests must prove behavior

**Rule.** AI-generated or mechanically generated tests must meet the same assertion,
fixture, and boundary-quality rules as human-authored tests.

**Why.** Generated tests often inflate coverage while asserting only mocks, existence, or
tautologies.

**vcqa.** Flag bursts of new tests with weak assertions, excessive mocks, identical test
shape, missing failure paths, or names that do not match the behavior asserted.

**References.**

- Testing Library Guiding Principles:
  <https://testing-library.com/docs/guiding-principles>

