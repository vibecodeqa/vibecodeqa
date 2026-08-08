# Testing And Observability

## R-TEST-1 - Preview smoke tests cover the seam

**Severity.** `high`, escalating to `blocker` when no check of any kind exercises the
deployed route graph, because R-SEAM-1 and R-SEAM-2 then have no runtime evidence.

**Rule.** Browser or HTTP smoke tests exercise at least one UI deep link and one API route
against a deployed preview or production-equivalent local preview, and assert on the
response rather than only on the absence of an exception.

**Why.** The seam can pass unit tests while failing in Pages routing.

**Scoring.** Each smoke assertion must check all three of status, `content-type`, and a
body marker. The minimum passing set is:

| Request | Status | `content-type` | Body assertion |
|---|---|---|---|
| `GET /<deep/link>` (a client-routed path, not `/`) | `200` | `text/html` | the app shell marker, for example the root element id or the build stamp |
| `GET /api/<known route>` | `200` | `application/json` | a named field of the documented response shape |
| `GET /api/<unknown route>` | `404` | `application/json` | the documented error shape, not the HTML shell |

A check that only asserts "the request did not throw", that asserts `200` without a
content type, or that runs against the dev server rather than the built and deployed
artifact does not satisfy this rule.

**vcqa.** Check Playwright, curl, or equivalent preview smoke tests; verify the target is a
deployment URL (or `wrangler pages dev` over the built output) and that the assertions
match the table above.

**Evidence.**

- Source/config: the smoke test files and the workflow step that runs them, including how
  the target URL is supplied.
- CI/artifacts: the retained transcript required by R-TEST-3.
- Runtime/deploy: the deployment URL published by R-OBS-2.
- Exception: `acceptedException` when the seam is exercised by an equivalent gate, naming
  that gate and its evidence, with owner, scope, and review date.

**References.**

- Pages Functions routing: <https://developers.cloudflare.com/pages/functions/routing/>
- Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>
- Playwright best practices: <https://playwright.dev/docs/best-practices>

## R-TEST-2 - Auth failures are tested as failures

**Severity.** `high`, escalating to `blocker` when there is no negative evidence at all for
a route that returns protected data.

**Rule.** Protected API routes have a test or smoke check proving unauthenticated access
is rejected.

**Why.** Missing negative auth tests let client-only guards hide broken server protection.

**Scoring.** The passing assertion set for at least one protected read and one protected
mutation is:

| Request | Status | `content-type` | Body assertion |
|---|---|---|---|
| protected `GET` with no credentials | `401` or `403` | `application/json` | the documented error shape; none of the protected fields present |
| protected mutating request with no credentials | `401` or `403` | `application/json` | the documented error shape; a follow-up read shows no state change |
| protected request with an invalid or expired credential | `401` or `403` | `application/json` | the documented error shape, with no stack trace or secret name |

Asserting only that the UI hides a control is not evidence for this rule.

**vcqa.** Look for 401/403 assertions or equivalent denial checks against the deployed or
locally previewed Functions, and confirm the checks run in the pipeline rather than only
locally.

**Evidence.**

- Source/config: the negative-auth test files and the workflow step running them.
- CI/artifacts: the retained transcript required by R-TEST-3, including the request line,
  the status, and the redacted response body.
- Runtime/deploy: the same assertions executed against the deployment URL.
- Exception: not available for routes returning protected data.

**References.**

- Pages Functions middleware:
  <https://developers.cloudflare.com/pages/functions/middleware/>
- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>

## R-TEST-3 - Smoke evidence is retained

**Severity.** `evidence-only`, escalating to `high` when the missing artifact is what would
show whether a `SEAM`, `AUTH`, or `DEPLOY` rule actually passed on the deployed artifact.

**Rule.** The smoke results required by R-TEST-1 and R-TEST-2 must be retained as CI
artifacts or durable logs attached to the run that produced them, uploaded even when the
run fails.

**Why.** A green tick is not evidence. Reviewing a Pages deployment after the fact requires
knowing which URL was probed, at which commit, and what came back.

**Scoring.** A retained record must contain, per assertion: the request method and path,
the deployment URL it ran against, the commit SHA, the timestamp, the response status, the
`content-type`, and the response body with credentials redacted. The upload must run on
failure as well as success, and the retention period must be stated explicitly rather than
left to the platform default. For browser-driven smoke tests, a trace or HAR for failed
runs satisfies the body/transcript requirement.

**vcqa.** Check the workflow for an artifact upload step covering the smoke output with
`if: always()` (or the equivalent always-run condition) and an explicit retention setting;
flag workflows that print smoke output to the console only, that upload artifacts a failing
run never produces, or that overwrite the previous run's evidence.

**Evidence.**

- Source/config: the workflow upload step, its condition, its retention setting, and the
  smoke runner's output path.
- CI/artifacts: the uploaded transcript, trace, or HAR from a real run, resolvable back to
  a commit and a deployment URL.
- Runtime/deploy: the deployment URL recorded inside the artifact matches the one published
  by R-OBS-2.
- Exception: `acceptedException` when evidence must be redacted or stored outside CI,
  naming owner, scope, the durable store, the retention period, compensating controls,
  evidence, expiry/review date, and approval trail.

**References.**

- Playwright best practices: <https://playwright.dev/docs/best-practices>
- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>

## R-OBS-1 - Server errors are observable without leaking to clients

**Severity.** `high`, escalating to `blocker` when the client-visible error discloses
credentials, connection details, or another tenant's data.

**Rule.** Functions return safe client errors while preserving server-side diagnostics.

**Why.** Operators need enough detail to debug, while clients should not receive internals.

**Scoring.** A pass requires both halves: a client response carrying a stable error code
and no internal detail, and a server-side log line for the same failure carrying enough
context to diagnose it — at minimum the route, the error class, and a correlation
identifier that also appears in the client response.

**vcqa.** Inspect error handling for safe responses and server-side logging; flag handlers
that log nothing on failure as well as handlers that serialize the caught error into the
response.

**Evidence.**

- Source/config: the shared error helper, the logging call sites, the correlation ID
  generation.
- CI/artifacts: the retained transcript for an induced failure.
- Runtime/deploy: a forced-failure request whose response carries the correlation ID, and a
  log entry retrievable for that ID.
- Exception: `acceptedException` for a documented debug mode disabled in production.

**References.**

- OWASP Error Handling Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html>
- OWASP Logging Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>

## R-OBS-2 - Deployment outputs include the live URL

**Severity.** `evidence-only`, escalating to `medium` when the smoke tests of R-TEST-1
cannot name the URL they ran against, and to `high` when no reviewer can tell whether
production or a preview was probed.

**Rule.** CI or deployment logs must expose the deployed Pages URL, and the smoke step must
consume that value rather than a hardcoded host.

**Why.** A fullstack Pages standard depends on verifying the actual deployed route graph.

**vcqa.** Check workflow output, deployment comments, or smoke-test configuration for the
deployment URL. Concretely: the deploy step's URL output is captured into a job output,
step summary, deployment status, or PR comment, and the smoke step reads it; a hardcoded
production host in the smoke step of a preview workflow is a finding.

**Evidence.**

- Source/config: the deploy step's output wiring and the smoke step's URL input.
- CI/artifacts: the run log or job summary containing the deployment URL, and the same URL
  inside the retained artifact from R-TEST-3.
- Runtime/deploy: the URL resolves and serves the deployed commit.
- Exception: `acceptedException` when the URL is intentionally private, naming where it is
  recorded and who can retrieve it.

**References.**

- Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>
- Pages direct upload from CI:
  <https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/>
