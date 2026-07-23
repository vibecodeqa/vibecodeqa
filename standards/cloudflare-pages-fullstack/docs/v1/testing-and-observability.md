# Testing And Observability

## R-TEST-1 - Preview smoke tests cover the seam

**Rule.** Browser or HTTP smoke tests exercise at least one UI deep link and one API route
against a deployed preview or production-equivalent local preview.

**Why.** The seam can pass unit tests while failing in Pages routing.

**vcqa.** Check Playwright, curl, or equivalent preview smoke tests.

## R-TEST-2 - Auth failures are tested as failures

**Rule.** Protected API routes have a test or smoke check proving unauthenticated access
is rejected.

**Why.** Missing negative auth tests let client-only guards hide broken server protection.

**vcqa.** Look for 401/403 assertions or equivalent denial checks.

## R-OBS-1 - Server errors are observable without leaking to clients

**Rule.** Functions return safe client errors while preserving server-side diagnostics.

**Why.** Operators need enough detail to debug, while clients should not receive internals.

**vcqa.** Inspect error handling for safe responses and server-side logging.

## R-OBS-2 - Deployment outputs include the live URL

**Rule.** CI or deployment logs should expose the deployed Pages URL for smoke checks and
review.

**Why.** A fullstack Pages standard depends on verifying the actual deployed route graph.

**vcqa.** Check workflow output, deployment comments, or smoke-test configuration for the
deployment URL.
