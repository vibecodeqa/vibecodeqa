# Typing And Validation

## R-TYPE-1 - API contracts cross the seam

**Rule.** Request and response shapes used by the frontend and Functions are typed or
schema-validated at the boundary.

**Why.** TypeScript does not validate data crossing the network boundary by itself.

**vcqa.** Look for shared types, generated clients, OpenAPI clients, Zod schemas, or
equivalent runtime parsing.

## R-VAL-1 - Function inputs are parsed before use

**Rule.** Query parameters, path parameters, headers, and JSON bodies are validated before
they affect database queries, service calls, or authorization decisions.

**Why.** Pages Functions receive untrusted HTTP input.

**vcqa.** Flag direct use of `request.json()`, URL params, or headers in side effects
without validation.

## R-TYPE-2 - Typed errors are part of the client contract

**Rule.** API clients should model expected error states without string-matching arbitrary
server messages.

**Why.** A frontend needs stable behavior for auth failures, validation errors, and server
failures.

**vcqa.** Check API client code for structured error handling.

## R-VAL-2 - Shared schemas do not leak server-only fields

**Rule.** Schemas shared with the frontend must not expose server-only fields or internal
authorization decisions.

**Why.** Sharing schemas is useful, but public schema modules become part of the browser
surface.

**vcqa.** Inspect shared schema exports for secret, internal, or privileged fields.
