# Auth And Security

## R-AUTH-1 - Client guards are not authorization

**Rule.** Protected API reads and writes are authorized in Pages Functions or middleware,
not only through client-side route guards.

**Why.** Browser code is user-controlled. A hidden button or guarded route does not protect
the same-origin API.

**vcqa.** Check protected Function handlers for middleware, token/session verification, or
explicit authorization checks.

## R-AUTH-2 - Middleware owns shared auth policy

**Rule.** Common authentication and session checks should live in Pages Functions
middleware or a shared server-side helper.

**Why.** Copy-pasted auth checks drift and leave individual routes under-protected.

**vcqa.** Identify repeated auth logic or routes that skip the shared middleware path.

## R-SEC-1 - Secrets never enter browser source

**Rule.** API keys, database credentials, service tokens, and signing secrets must not be
present in frontend source, frontend env, or built assets.

**Why.** A static frontend is public after deployment.

**vcqa.** Scan frontend files and `VITE_*` variables for secret-like names and values.

## R-SEC-2 - API errors are safe for clients

**Rule.** Function responses should not expose stack traces, SQL text, raw provider errors,
or secret names to the browser.

**Why.** Same-origin APIs often feed errors directly into frontend UI. Unsafe errors become
information disclosure.

**vcqa.** Inspect error handlers for safe client messages and server-side logging.

## R-SEC-3 - Unsafe methods require intent checks

**Rule.** Mutating methods such as `POST`, `PUT`, `PATCH`, and `DELETE` require an
authorization check and request validation before side effects.

**Why.** Same-origin routing alone is not a permission model.

**vcqa.** Flag mutating handlers that perform side effects before auth and validation.
