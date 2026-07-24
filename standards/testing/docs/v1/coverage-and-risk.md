# Coverage and risk

## R-COV-1 - Coverage thresholds protect behavior-bearing code

**Rule.** Coverage thresholds must exist for behavior-bearing code, with exclusions for
generated, config, entrypoint, or pure presentation files documented.

**Why.** Coverage is not proof by itself, but a threshold prevents tested code from eroding
silently over time.

**vcqa.** Flag repos with test runners but no coverage command or threshold, and flag
blanket exclusions that remove most source code from coverage.

**References.**

- Vitest Guide: <https://vitest.dev/guide/>

## R-COV-2 - Changed critical code is tested

**Rule.** Pull requests that change critical behavior must add or update tests unless the
change is covered by existing tests and the reviewer can see the link.

**Why.** Overall coverage can stay high while new risk enters untested code. Changed-code
testing catches drift at the point of change.

**vcqa.** Compare changed source files to changed tests and existing coverage signals; flag
critical changes with no test delta or documented existing coverage.

**References.**

- GitHub Actions deployments and environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>

## R-RISK-2 - Coverage numbers are not gamed

**Rule.** Coverage configuration must not use thresholds, exclusions, or generated tests
to create a misleading score.

**Why.** A high coverage percentage can hide shallow assertions, excluded core logic, and
snapshot-only tests.

**vcqa.** Flag suspicious 0% thresholds, broad `src/**` exclusions, blanket ignores, and
coverage increases caused mostly by trivial generated tests.

**References.**

- Vitest Guide: <https://vitest.dev/guide/>

