# Mocks, fixtures, and snapshots

## R-MOCK-1 - Mocks do not replace the behavior under test

**Rule.** A test may mock dependencies, providers, time, randomness, or network responses,
but must not mock away the code path it claims to verify.

**Why.** Over-mocking creates tests that only prove the mock setup. This is especially easy
when AI-generated tests mock every imported module.

**vcqa.** Flag test files with more mocked app modules than assertions, or tests that mock
the subject under test and then assert mocked return values.

**References.**

- Testing Library Guiding Principles:
  <https://testing-library.com/docs/guiding-principles>

## R-FIXTURE-1 - Fixtures are realistic and maintained

**Rule.** Fixtures must represent valid and invalid real-world shapes, and must be updated
when public contracts change.

**Why.** Stale or toy fixtures miss contract drift. Realistic fixtures catch serialization,
validation, optional-field, and compatibility failures.

**vcqa.** Flag fixtures made only of empty objects, single-field examples, or names like
`foo`/`bar` where the production schema is richer.

**References.**

- Vitest Guide: <https://vitest.dev/guide/>

## R-SNAP-1 - Snapshots are narrow and reviewed

**Rule.** Snapshots must be small enough to review and paired with behavior assertions when
the output has user or API semantics.

**Why.** Large snapshots are often accepted blindly. They detect change, not correctness.

**vcqa.** Flag large snapshot files, snapshot-only tests for interactive behavior, and
snapshot updates with no nearby assertion or explanation.

**References.**

- Vitest Guide: <https://vitest.dev/guide/>

