# Boundary typing and validation

## R-BOUNDARY-1 - External data is validated before trust

**Rule.** Data from HTTP, webhooks, MCP tools, forms, storage, databases, config files,
environment variables, generated clients, and provider SDKs must be runtime-validated before
it is treated as a trusted TypeScript domain type.

**Why.** TypeScript types do not exist at runtime. A `User` type does not make incoming JSON
valid.

**vcqa.** Flag bare casts from `json()`, request bodies, env/config reads, tool arguments,
storage values, or provider responses without schema parse, type guard, or equivalent
validation.

**References.**

- TypeScript Handbook: <https://www.typescriptlang.org/docs/handbook/intro.html>

## R-BOUNDARY-2 - Unknown is narrowed close to the boundary

**Rule.** Values whose shape is unknown at runtime should be modeled as `unknown` until a
schema, parser, type guard, or explicit narrowing step proves their shape.

**Why.** `unknown` keeps the unsafe value contained. Letting it spread as `any` or a blind
domain type contaminates downstream code.

**vcqa.** Flag boundary helpers that return trusted domain types directly from unvalidated
external data, or that expose `any` instead of `unknown` plus narrowing.

**References.**

- TypeScript Handbook: <https://www.typescriptlang.org/docs/handbook/intro.html>

## R-BOUNDARY-3 - Runtime schema and TypeScript type stay aligned

**Rule.** When runtime schemas exist, the trusted TypeScript type and schema must describe
the same boundary.

**Why.** Drift between schema and type creates false confidence: validation may accept a
shape callers cannot handle, or reject a shape types advertise as supported.

**vcqa.** Flag duplicated schema/type definitions with obvious field drift, stale generated
types, or public types not derived from or tested against the runtime contract.

**References.**

- TypeScript Handbook: <https://www.typescriptlang.org/docs/handbook/intro.html>
