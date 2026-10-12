# State storage and audit

## R-STATE-1 - Cross-call state uses explicit scoped handles

**Severity.** `high`, escalating to `blocker` when hidden state affects authorization,
tenant data, or mutations.

**Rule.** Any state that must survive across MCP calls must be represented by explicit,
server-minted handles or scoped storage keys passed as ordinary arguments and reauthorized
on every request. The server must not infer state from a connection, stream, session ID, or
previous request.

**Why.** MCP `2026-07-28` removed protocol-level sessions. Stateful application workflows
must be explicit and reviewable.

**Evidence.**

- Source/config: handle minting, storage key construction, expiration, actor/tenant
  ownership checks.
- CI/artifacts: tests for wrong actor, wrong tenant, expired handle, replay, and missing
  handle.
- Runtime/deploy: trace showing handle creation and subsequent authorized use.
- Exception: no exception for protected state. Legacy session state belongs in a declared
  compatibility lane.

**vcqa.** Flag state maps keyed by connection/session, request-order assumptions, or
handles that omit actor/tenant/resource scope.

**References.**

- MCP statelessness:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic#statelessness>
- MCP `2026-07-28` changelog:
  <https://modelcontextprotocol.io/specification/2026-07-28/changelog>

## R-STATE-2 - Durable Object IDs match the coordination boundary

**Severity.** `high`, escalating to `blocker` when tenants, users, or protected resources
share an object by accident.

**Rule.** Durable Object IDs used by MCP tools must be derived from the tenant, actor,
session-equivalent handle, resource, or workflow boundary they coordinate, and the
authorization check must prove the current request can use that object.

**Why.** Durable Objects are a strong coordination primitive, but a broad object ID can mix
unrelated tenants or resources behind one remote tool surface.

**Evidence.**

- Source/config: Durable Object binding, ID derivation, object methods, authorization
  checks.
- CI/artifacts: tests for separate tenants/resources and denied cross-scope object access.
- Runtime/deploy: object ID/key examples in runbook with sensitive values redacted.
- Exception: accepted only for global read-only metadata objects; include owner, scope,
  read-only proof, evidence, review date, and approval trail.

**vcqa.** Flag `idFromName("global")`, unscoped names, or object keys built before
authorization without tests proving isolation.

**References.**

- Cloudflare Durable Objects:
  <https://developers.cloudflare.com/durable-objects/>
- Cloudflare Durable Objects best practices:
  <https://developers.cloudflare.com/durable-objects/best-practices/>

## R-STATE-3 - Storage choice matches sensitivity and consistency

**Severity.** `medium`, escalating to `high` for sensitive, tenant, audit, or mutation
state.

**Rule.** KV, R2, D1, Durable Objects, service bindings, and in-memory caches must be used
only for state whose consistency, sensitivity, retention, and tenant isolation requirements
match that storage model.

**Why.** Remote tools often bridge model calls to product data. Storage shortcuts become
security and audit defects when they hide ownership or consistency boundaries.

**Evidence.**

- Source/config: binding usage, key prefixes, schema/migration files, retention policy,
  cache TTLs.
- CI/artifacts: tests for tenant key scoping, stale cache behavior, and mutation
  consistency where relevant.
- Runtime/deploy: storage inventory and data-classification notes.
- Exception: `acceptedException` must name data class, owner, environment/tenant, controls,
  evidence, expiry/review date, and approval trail.

**vcqa.** Flag tenant/user data in unscoped KV/R2 prefixes, persistent state only in module
globals, or audit-critical mutations with no durable record.

**References.**

- Cloudflare Workers bindings:
  <https://developers.cloudflare.com/workers/runtime-apis/bindings/>
- Cloudflare D1:
  <https://developers.cloudflare.com/d1/>
- Cloudflare Durable Objects:
  <https://developers.cloudflare.com/durable-objects/>

## R-AUDIT-1 - Mutations and denied mutations leave audit evidence

**Severity.** `high`, escalating to `blocker` for tools that can mutate production,
customer, billing, permission, secret, or deployment state.

**Rule.** Every mutating tool call and denied mutation attempt must produce audit evidence
with actor/client, tenant/environment, tool, target resource, side-effect class, decision,
outcome, timestamp, request correlation ID, and approval/consent reference where relevant.

**Why.** Remote MCP tools are operational entrypoints. Operators need to investigate who or
what caused a side effect and why it was allowed or denied.

**Evidence.**

- Source/config: audit event builder, logging/storage sink, correlation ID propagation,
  redaction policy.
- CI/artifacts: tests asserting audit event fields on allowed and denied mutation paths.
- Runtime/deploy: retained audit sample or redacted log query.
- Exception: accepted only for local/dev tools with no production data access; include
  owner, environment scope, controls, evidence, expiry/review date, and approval trail.

**vcqa.** Flag mutating handlers with no audit call, audit events missing actor/tool/target
or outcome, or tests that verify success without checking audit.

**References.**

- OWASP Logging Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>
- MCP security best practices:
  <https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices>

## R-AUDIT-2 - Audit and logs redact sensitive payloads

**Severity.** `high` when secrets, tokens, prompts, customer data, or tool arguments can be
logged; otherwise `medium`.

**Rule.** Audit records and logs must preserve decision evidence without storing bearer
tokens, OAuth responses, secrets, full prompts, large fetched documents, or unnecessary
customer data.

**Why.** Observability for remote tools should not create a second data leak path.

**Evidence.**

- Source/config: redaction helper, logger config, audit schema, denied/success event tests.
- CI/artifacts: tests proving sensitive fields are redacted or omitted.
- Runtime/deploy: logging retention and access policy.
- Exception: `acceptedException` must name the sensitive field, owner, environment/tenant,
  reason, controls, evidence, expiry/review date, and approval trail.

**vcqa.** Flag logging of `Authorization`, `access_token`, `refresh_token`, raw prompts,
full request bodies, or full tool arguments in audit/log paths.

**References.**

- OWASP Logging Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>
- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>
