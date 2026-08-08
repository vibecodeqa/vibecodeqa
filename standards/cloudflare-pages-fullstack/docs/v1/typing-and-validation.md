# Typing And Validation

## R-TYPE-1 - API contracts cross the seam

**Severity.** `medium`, escalating to `high` when the untyped contract carries
authorization, tenant, or money fields.

**Rule.** Request and response shapes used by the frontend and Functions must be typed or
schema-validated at the boundary, from a single declared source rather than two hand-kept
copies.

**Why.** TypeScript does not validate data crossing the network boundary by itself.

**Scoring.** A pass is one of: a shared types module imported by both sides, a generated
client from an OpenAPI or schema document, or a schema module (for example Zod) used by the
handler and re-used by the client. Two independently maintained interface declarations for
the same payload is a fail.

**vcqa.** Look for shared types, generated clients, OpenAPI clients, Zod schemas, or
equivalent runtime parsing; flag duplicated payload interfaces with no shared origin.

**Evidence.**

- Source/config: the shared types or schema module, the API client, the Function handlers.
- CI/artifacts: `tsc` step covering both slices, and any client-generation step with its
  freshness check.
- Exception: `acceptedException` naming the payload, why the copy exists, and the
  compensating contract test.

**References.**

- TypeScript handbook:
  <https://www.typescriptlang.org/docs/handbook/intro.html>
- OpenAPI specification: <https://spec.openapis.org/oas/latest.html>

## R-VAL-1 - Function inputs are parsed before use

**Severity.** `high`, escalating to `blocker` when unvalidated input reaches a binding call,
an authorization decision, or an outbound privileged request.

**Rule.** Query parameters, path parameters, headers, and JSON bodies are validated before
they affect database queries, service calls, or authorization decisions.

**Why.** Pages Functions receive untrusted HTTP input.

**vcqa.** Flag direct use of `request.json()`, URL params, or headers in side effects
without validation. Concretely, for each handler, check that the value returned by
`request.json()`, `new URL(request.url).searchParams`, `context.params`, or
`request.headers.get(...)` passes through a parse/validate call before it is interpolated
into a query, passed to a binding method, or compared in an authorization branch.

**Evidence.**

- Source/config: handler input paths, the schema module, and the parse call sites.
- CI/artifacts: tests asserting a `400` (or documented status) for malformed input.
- Runtime/deploy: a smoke request with a malformed body returning the documented validation
  status and a JSON error body.
- Exception: `acceptedException` for a documented opaque pass-through, with compensating
  controls and a review date.

**References.**

- OWASP Input Validation Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html>
- Zod: <https://zod.dev/>

## R-TYPE-2 - Typed errors are part of the client contract

**Severity.** `low`, escalating to `medium` when the client branches on a free-text server
message to decide an auth or retry behavior.

**Rule.** API clients must model expected error states through a stable discriminator —
HTTP status plus a machine-readable error code — rather than string-matching arbitrary
server messages.

**Why.** A frontend needs stable behavior for auth failures, validation errors, and server
failures.

**Scoring.** A pass requires the error body shape to be declared once (for example
`{ error: { code, message } }`) and the client to branch on status or `code`. Any
`message.includes("...")` branch controlling behavior is a fail.

**vcqa.** Check API client code for structured error handling and flag behavior branches
keyed on server message text.

**Evidence.**

- Source/config: the error type/schema, the API client error path, the Function error
  helper.
- CI/artifacts: tests covering at least the auth-failure and validation-failure branches.
- Exception: `acceptedException` for a third-party error surface the repo does not control.

**References.**

- OWASP Error Handling Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html>
- TypeScript handbook:
  <https://www.typescriptlang.org/docs/handbook/intro.html>

## R-VAL-2 - Shared schemas do not leak server-only fields

**Severity.** `high`, escalating to `blocker` when the leaked field is a credential, token,
or another tenant's identifier.

**Rule.** Schemas shared with the frontend must not expose server-only fields or internal
authorization decisions.

**Why.** Sharing schemas is useful, but public schema modules become part of the browser
surface.

**vcqa.** Inspect shared schema exports for secret, internal, or privileged fields; check
that the response is projected through an explicit output schema rather than returning a
database row object directly.

**Evidence.**

- Source/config: shared schema exports, the response projection in each handler.
- CI/artifacts: tests asserting the response body keys for at least one record-returning
  route.
- Negative evidence: no internal column, hash, or token key appears in a response body.
- Exception: `acceptedException` naming the field, why it is exposed, and its
  classification review.

**References.**

- Zod: <https://zod.dev/>
- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
