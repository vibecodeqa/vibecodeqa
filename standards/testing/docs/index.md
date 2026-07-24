# Testing Gold Standard

The Testing standard is the cross-cutting VibeCode QA rubric for proving behavior before
code ships. It applies to every repo slice unless a slice is explicitly non-executable
documentation or generated output.

Testing is not measured by test count alone. A repo passes this standard when tests cover
the behavior users, operators, maintainers, and downstream consumers rely on, and when the
CI pipeline leaves enough evidence to trust the result.

## Latest edition

- [Testing v1](v1/index.md)

## Scope

This standard governs:

- test strategy and risk scope
- unit tests for deterministic logic
- integration tests for boundaries
- UI and component tests for rendered behavior
- E2E smoke tests for deployable user flows
- coverage thresholds and documented exceptions
- mocks, fixtures, snapshots, and generated tests
- CI gates and failure evidence
- flaky, skipped, and quarantined tests

## Not in scope

- Framework-specific test runner doctrine already covered by Vitest, Playwright, Testing
  Library, Flutter, or platform docs.
- Security-specific deploy controls covered by [Security v1](/standards/security/v1/).
- Stack-specific smoke paths covered by authored stack standards.

