# Integration tests

## R-INT-1 - Boundaries are tested at the exposed seam

**Rule.** Integration tests must exercise the boundary a slice exposes: HTTP route,
database adapter, filesystem contract, package API, CLI command, Worker handler, MCP tool,
or provider SDK wrapper.

**Why.** Mocking away the boundary proves only the mock. Integration tests catch contract
drift between code that unit tests can inspect only in isolation.

**vcqa.** Flag repos with API/database/provider/protocol code but no tests that call the
actual boundary function, route handler, command entry, or public package export.

**References.**

- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>

## R-BOUNDARY-1 - Boundary tests cover failure modes

**Rule.** Integration tests must include representative failure modes such as validation
failure, provider failure, authorization denial, missing resource, timeout, or migration
error where those modes exist.

**Why.** Boundary failures are where users and operators experience outages. A test that
only proves success does not prove recovery or safe rejection.

**vcqa.** Flag integration suites that call boundary code only with successful fixtures and
never assert error status, error shape, retry, rollback, or denial behavior.

**References.**

- GitHub Actions deployments and environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>

## R-INT-2 - Integration fixtures are isolated

**Rule.** Integration tests must use isolated local, preview, fake, or disposable fixtures;
they must not depend on mutable production data or shared user accounts.

**Why.** Production-coupled tests are unsafe and non-deterministic. They can leak data,
mutate real resources, or fail because another operator changed state.

**vcqa.** Flag test commands, env names, URLs, or secrets that point integration tests at
production resources without an explicit read-only exception.

**References.**

- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>

