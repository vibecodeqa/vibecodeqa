# Tool schemas and validation

## R-TOOL-1 - Tool contracts are narrow and executable

**Severity.** `high`, escalating to `blocker` for mutating tools with broad or prose-only
inputs.

**Rule.** Every tool must have a stable name, clear description, bounded input schema,
side-effect classification, and permission requirement. Inputs must be represented as
typed/schema-constrained fields rather than generic JSON blobs or instruction strings.

**Why.** MCP tools are model-controlled capabilities. The schema and metadata are what
clients see and what reviewers can judge.

**Evidence.**

- Source/config: tool registration, names/descriptions, input schemas, permission metadata.
- CI/artifacts: schema snapshot or protocol fixture for `tools/list`.
- Runtime/deploy: tool list transcript from preview/prod.
- Exception: accepted only for zero-argument read-only tools; include owner, tool scope,
  evidence, review date, and approval trail.

**vcqa.** Flag tools named `runCommand`, `adminAction`, `query`, `fetch`, or `execute` with
generic string/object inputs and no side-effect or permission metadata.

**References.**

- MCP tools:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/tools>
- MCP TypeScript SDK:
  <https://github.com/modelcontextprotocol/typescript-sdk>

## R-TOOL-2 - Tool descriptions do not carry hidden policy

**Severity.** `medium`, escalating to `high` when descriptions are the only place a safety,
permission, tenant, or side-effect boundary is declared.

**Rule.** Tool descriptions and instructions may explain intended use, but authorization,
validation, consent, tenancy, and side-effect controls must be enforced in code and tests.

**Why.** Descriptions are model-facing hints, not a trustworthy policy boundary.

**Evidence.**

- Source/config: tool descriptions plus matching code-level guards.
- CI/artifacts: tests proving prohibited actions fail even if arguments or text ask for
  them.
- Runtime/deploy: representative denial transcript.
- Exception: no exception for protected or mutating tools. Read-only advisory text may be
  documented with owner, scope, evidence, and review date.

**vcqa.** Flag "only use if", "must not", "admin only", or tenant/security requirements in
descriptions with no corresponding code-level check.

**References.**

- MCP tools:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/tools>
- MCP security best practices:
  <https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices>

## R-TOOL-3 - Structured outputs have schemas where clients act on them

**Severity.** `medium`, escalating to `high` when downstream clients use tool output for
authorization-sensitive actions, writes, routing, or user-visible decisions.

**Rule.** Tools whose results are consumed by clients or subsequent automation must define
structured output schemas or a documented result contract, and tests must prove success and
failure shapes.

**Why.** Free-form text is hard to validate and easy to misinterpret when another tool or
agent uses it as data.

**Evidence.**

- Source/config: output schema, structured content, result type definitions, client
  fixtures.
- CI/artifacts: result-shape tests for success, validation failure, authorization denial,
  and partial/input-required flows where present.
- Runtime/deploy: representative tool call transcript.
- Exception: accepted for human-readable-only tools whose output is never parsed; include
  owner, tool scope, evidence, expiry/review date, and approval trail.

**vcqa.** Flag tools returning JSON-like text without schemas where callers parse it, or
tests that only assert a text field exists.

**References.**

- MCP tools:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/tools>
- MCP schema reference:
  <https://modelcontextprotocol.io/specification/2026-07-28/schema>

## R-VAL-1 - Parsed arguments drive authorization and side effects

**Severity.** `blocker` for mutating tools; `high` for read tools touching protected data.

**Rule.** Tool arguments must be parsed and validated with Zod or an equivalent runtime
schema before authorization-sensitive decisions, storage keys, fetch URLs, SQL queries, or
side effects use them.

**Why.** TypeScript types and MCP schemas do not prove runtime input safety at the Worker
boundary.

**Evidence.**

- Source/config: Zod or equivalent schemas, `parse`/`safeParse` calls, sanitized values
  passed to authz and side-effect code.
- CI/artifacts: invalid input, boundary input, and malicious input tests.
- Runtime/deploy: validation failure transcript with safe error shape.
- Exception: accepted only for generated SDK validation with tests proving rejection;
  include owner, generated scope, evidence, review date, and approval trail.

**vcqa.** Flag handlers that use raw `params`, `args`, or `request.json()` values for
authorization, state keys, fetches, or mutations before validation.

**References.**

- Zod documentation:
  <https://zod.dev/>
- MCP tools:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/tools>
- OWASP Input Validation Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html>

## R-VAL-2 - Header-routed parameters are allowlisted and revalidated

**Severity.** `high`.

**Rule.** Any tool parameter advertised with `x-mcp-header` or mirrored into
`Mcp-Param-*` must be allowlisted, low-sensitivity enough for header transport, and
validated against the JSON-RPC body before routing, rate limiting, tenancy, or permission
decisions trust it.

**Why.** MCP `2026-07-28` permits custom headers from tool parameters so intermediaries can
route or enforce policy, but headers are visible to different infrastructure and can diverge
from the body if not validated.

**Evidence.**

- Source/config: schema annotations, header allowlist, proxy/routing config, validation
  helper.
- CI/artifacts: tests for absent, mismatched, encoded, and invalid header parameter values.
- Runtime/deploy: route/rate-limit transcript if an intermediary uses the header.
- Exception: accepted only when no intermediary trusts the header and the SDK handles
  validation; include owner, SDK version, scope, evidence, review date, and approval trail.

**vcqa.** Flag `x-mcp-header`, `Mcp-Param-*`, or custom route headers used for tenant/tool
policy without allowlist and body-mismatch tests.

**References.**

- MCP Streamable HTTP:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http>
- MCP tools:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/tools>

## R-VAL-3 - Multi-round input remains bounded

**Severity.** `medium`, escalating to `high` when missing input can change authorization,
target resources, or side effects.

**Rule.** Tools that return `input_required` or otherwise perform multi-round input must
preserve the original authorization context, validate returned input, and enforce retry,
timeout, and audit boundaries.

**Why.** Stateless MCP supports multi-round interactions without turning the transport into
a session. The server must not treat later input as implicitly authorized or validated.

**Evidence.**

- Source/config: `input_required` result handling, continuation tokens/handles, timeout and
  retry policy.
- CI/artifacts: tests for missing input, invalid follow-up input, expired handles, and
  wrong actor/tenant continuation.
- Runtime/deploy: audit or trace showing initial and completed operation correlation.
- Exception: accepted only for read-only clarification flows; include owner, tool scope,
  evidence, review date, and approval trail.

**vcqa.** Flag input-required flows with no continuation validation, no timeout, or
follow-up tests that reuse a different actor/tenant successfully.

**References.**

- MCP basic protocol:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic>
- Cloudflare migrate to MCP SDK v2:
  <https://developers.cloudflare.com/agents/model-context-protocol/guides/migrate-to-mcp-sdk-v2/>
