# Auth And Security

## R-AUTH-1 - Client guards are not authorization

**Severity.** `blocker` when an unauthenticated request can read or mutate protected data
through a Function; otherwise `high` when the check exists but is not reachable on every
protected route.

**Rule.** Protected API reads and writes are authorized in Pages Functions or middleware,
not only through client-side route guards.

**Why.** Browser code is user-controlled. A hidden button or guarded route does not protect
the same-origin API.

**vcqa.** Check protected Function handlers for middleware, token/session verification, or
explicit authorization checks. Concretely, for each handler under the API prefix, resolve
whether a `functions/**/_middleware.ts` on its path prefix runs an auth check, or the
handler itself verifies a session cookie, bearer token, or Cloudflare Access assertion
before touching a binding.

**Evidence.**

- Source/config: `functions/**/_middleware.ts`, per-handler auth calls, the session/token
  verification helper.
- CI/artifacts: the negative-auth test or smoke assertion from R-TEST-2 and its retained
  transcript.
- Runtime/deploy: unauthenticated `GET`/`POST` to a protected path returns `401` or `403`
  with a JSON body and no protected data.
- Exception: not available for protected data. A genuinely public route is not an
  exception, it is a different route classification and must be labelled as such in the
  repo.

**References.**

- Pages Functions middleware:
  <https://developers.cloudflare.com/pages/functions/middleware/>
- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>

## R-AUTH-2 - Middleware owns shared auth policy

**Severity.** `medium`, escalating to `high` when duplicated checks have already diverged,
so that two protected routes enforce different policies.

**Rule.** Common authentication and session checks must live in Pages Functions middleware
or a shared server-side helper. Per-route copies are allowed only with an
`acceptedException` naming the route and the reason.

**Why.** Copy-pasted auth checks drift and leave individual routes under-protected.

**Scoring.** The same verification logic reimplemented in two or more handlers, with no
shared middleware or helper on their path, is a fail. A shared helper called from each
handler is a pass; middleware is the preferred shape.

**vcqa.** Identify repeated auth logic or routes that skip the shared middleware path;
compare the set of handlers under the API prefix against the set covered by a
`_middleware.ts` at or above their directory.

**Evidence.**

- Source/config: middleware files, the shared auth helper, and every handler that verifies
  credentials itself.
- CI/artifacts: tests covering the shared path and any route that opts out.
- Exception: `acceptedException` with owner, scope, environment/tenant, reason,
  compensating controls, evidence, expiry/review date, and approval trail.

**References.**

- Pages Functions middleware:
  <https://developers.cloudflare.com/pages/functions/middleware/>
- OWASP Session Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html>

## R-SEC-1 - Secrets never enter browser source

**Severity.** `blocker`. A secret in a static asset is published, not configured.

**Rule.** API keys, database credentials, service tokens, and signing secrets must not be
present in frontend source, frontend env, or built assets.

**Why.** A static frontend is public after deployment.

**vcqa.** Scan frontend files and `VITE_*` variables for secret-like names and values.
Concretely, flag any `VITE_`-prefixed name matching `SECRET|TOKEN|PRIVATE|PASSWORD|_KEY`
(excluding names explicitly marked publishable), any long high-entropy literal in browser
source, and any committed `.env*` carrying real values.

**Evidence.**

- Source/config: `src/**`, `.env*` files and their gitignore status, the deploy workflow's
  build-time environment.
- CI/artifacts: a secret scan step over the built output directory.
- Negative evidence: no production secret appears in the built assets that CI published.
- Exception: not available.

**References.**

- Vite env and mode: <https://vite.dev/guide/env-and-mode>
- Workers secrets: <https://developers.cloudflare.com/workers/configuration/secrets/>
- OWASP Secrets Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>

## R-SEC-2 - API errors are safe for clients

**Severity.** `high`, escalating to `blocker` when a client-visible error discloses
credentials, connection strings, or binding secrets.

**Rule.** Function responses must not expose stack traces, SQL text, raw provider errors,
or secret names to the browser.

**Why.** Same-origin APIs often feed errors directly into frontend UI. Unsafe errors become
information disclosure.

**vcqa.** Inspect error handlers for safe client messages and server-side logging. Flag a
`catch` block that serializes the caught error into the response body, returns
`error.stack`, or forwards a provider error object verbatim.

**Evidence.**

- Source/config: the shared error-response helper and each handler's `catch` path.
- CI/artifacts: retained smoke transcript showing an induced failure response body.
- Runtime/deploy: a forced-failure request whose body contains a stable error code and no
  stack frame, SQL fragment, or binding name.
- Exception: `acceptedException` for a documented debug mode that is disabled in
  production, with owner, scope, environment, and review date.

**References.**

- OWASP Error Handling Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html>
- Cloudflare Pages Functions: <https://developers.cloudflare.com/pages/functions/>

## R-SEC-3 - Unsafe methods require intent checks

**Severity.** `blocker` when a mutating handler reaches a binding with no authorization
check; otherwise `high` when authorization exists but input is unvalidated before the side
effect.

**Rule.** Mutating methods such as `POST`, `PUT`, `PATCH`, and `DELETE` require an
authorization check and request validation before side effects.

**Why.** Same-origin routing alone is not a permission model.

**vcqa.** Flag mutating handlers that perform side effects before auth and validation.
Trace, per handler, the order of: credential verification, schema parse of body/params, and
first binding call (`env.DB.prepare`, `env.KV.put`, `env.BUCKET.put`, `fetch` to a
privileged upstream). Any binding call before the first two is a finding.

**Evidence.**

- Source/config: `onRequestPost`/`onRequestPut`/`onRequestPatch`/`onRequestDelete`
  handlers and the middleware on their path.
- CI/artifacts: tests asserting rejection of unauthenticated and malformed mutations.
- Runtime/deploy: unauthenticated mutation smoke assertion returning `401`/`403` with no
  state change.
- Exception: not available for authorization. Validation may carry an
  `acceptedException` for a documented pass-through payload with compensating controls.

**References.**

- OWASP CSRF Prevention Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html>
- OWASP Input Validation Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html>
