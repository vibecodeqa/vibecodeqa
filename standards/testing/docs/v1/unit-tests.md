# Unit tests

## R-UNIT-1 - Deterministic logic has meaningful assertions

**Rule.** Deterministic logic must have tests that assert outputs, state transitions,
errors, or observable side effects for representative inputs.

**Why.** Logic with no assertions over behavior can break while the suite stays green.

**vcqa.** Flag modules with exported functions/classes and no nearby tests, and flag tests
whose assertions only check existence for behavior-bearing code.

**References.**

- Vitest Guide: <https://vitest.dev/guide/>

## R-UNIT-2 - Tautology and empty tests are failures

**Rule.** Tests must not be empty, tautological, or unrelated to the unit under test.

**Why.** `expect(true).toBe(true)` and empty test bodies increase confidence metrics while
proving nothing. This is a common failure mode in AI-generated test suites.

**vcqa.** Flag empty `it`/`test` bodies, assertions over constants, tests with no
expectation or awaited failure, and tests whose only assertions are tautologies.

**References.**

- Vitest Guide: <https://vitest.dev/guide/>

## R-UNIT-3 - Error and edge paths are represented

**Rule.** Unit tests for parsing, validation, transformation, permission, and branching
logic must include at least one error or edge case for each material branch.

**Why.** Happy-path-only tests miss the branches that most often fail under real input.

**vcqa.** Flag behavior-bearing test files where all inputs look like happy-path fixtures
and no assertion covers thrown errors, invalid input, boundary values, or rejected promises.

**References.**

- Vitest Guide: <https://vitest.dev/guide/>

