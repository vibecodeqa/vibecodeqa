# Output safety and observability

## R-OUT-1 - Tool output is untrusted data

**Severity.** `high`.

**Rule.** Tool output, fetched content, resource contents, prompt templates, and model-facing
instructions returned by tools must be treated as untrusted data. They must not override
authorization, validation, consent, system prompts, or later tool policy.

**Why.** MCP tools can expose content from users, tenants, websites, files, and APIs.
Returning text to a model must not turn that text into server policy.

**Evidence.**

- Source/config: output construction, resource fetchers, prompt/resource/tool result
  handlers, downstream agent/tool chaining code.
- CI/artifacts: prompt-injection or malicious-content fixtures that prove policy is not
  bypassed.
- Runtime/deploy: runbook guidance for investigating unsafe output.
- Exception: no exception for protected or mutating tools. Public read-only demos must
  include owner, scope, controls, evidence, review date, and approval trail.

**vcqa.** Flag code that parses returned tool text as instructions for later server-side
authorization, shell/API calls, or policy without an independent validation layer.

**References.**

- MCP security best practices:
  <https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices>
- MCP tools:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/tools>

## R-OUT-2 - Tool results do not expose credentials or hidden policy

**Severity.** `blocker` when secrets or credentials can be returned; otherwise `high`.

**Rule.** Tool outputs and error details must not include bearer tokens, OAuth responses,
secret values, hidden system/developer policy, internal authorization rules, unrelated
tenant data, or unredacted audit payloads.

**Why.** MCP output is often copied into model context and client logs. Secrets or hidden
policy in output can leak beyond the Worker boundary.

**Evidence.**

- Source/config: output builders, error serializers, redaction helpers, resource readers.
- CI/artifacts: tests for token/secret/error redaction and cross-tenant output denial.
- Runtime/deploy: redacted sample outputs.
- Exception: no exception for secrets or tokens. Diagnostic-only metadata requires
  `acceptedException` with owner, protected environment, access controls, evidence,
  expiry/review date, and approval trail.

**vcqa.** Flag outputs containing names such as `token`, `secret`, `cookie`,
`Authorization`, full request headers, policy prompts, or raw provider responses.

**References.**

- MCP security best practices:
  <https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices>
- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>

## R-OBS-1 - Requests carry correlation through tool execution

**Severity.** `medium`, escalating to `high` for mutating, tenant, security, or production
operations.

**Rule.** Each MCP request must have a correlation ID that flows through authorization,
validation, tool execution, storage, audit, and safe error output.

**Why.** Stateless requests are independent. Correlation is how operators connect a client
request to the resulting logs, audit events, rate-limit decisions, and side effects.

**Evidence.**

- Source/config: request ID/correlation helper, logger/audit integration, response/error
  metadata policy.
- CI/artifacts: tests asserting correlation appears in logs/audit and does not expose
  secrets.
- Runtime/deploy: log query or incident runbook.
- Exception: accepted only for read-only public routes; include owner, scope, evidence,
  review date, and approval trail.

**vcqa.** Flag log/audit calls without request IDs, generated IDs not propagated to tool
handlers, or errors that cannot be tied to a server-side record.

**References.**

- OWASP Logging Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>
- MCP basic protocol:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic>

## R-OBS-2 - Public errors are safe and actionable

**Severity.** `medium`, escalating to `high` when errors can leak secrets, tenant data,
authorization internals, or provider payloads.

**Rule.** MCP error responses must use structured JSON-RPC errors, safe messages, and
bounded diagnostic data. Internal stack traces, provider responses, secrets, prompts, and
raw validation payloads must stay out of public responses.

**Why.** Clients need actionable errors, but remote MCP errors often flow into model
context, logs, and user-visible transcripts.

**Evidence.**

- Source/config: error serializer, validation error mapping, auth denial mapping.
- CI/artifacts: tests for validation, auth, unsupported-version, header mismatch, provider
  failure, and unexpected exceptions.
- Runtime/deploy: smoke transcript for representative failure cases.
- Exception: `acceptedException` only for protected debug environments; include owner,
  environment scope, controls, evidence, expiry/review date, and approval trail.

**vcqa.** Flag `err.stack`, raw exception messages, provider bodies, full request bodies, or
unbounded validation details returned to MCP clients.

**References.**

- MCP basic protocol:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic>
- MCP Streamable HTTP:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http>
- OWASP Error Handling Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html>

## R-ABUSE-1 - Expensive and fan-out tools are bounded

**Severity.** `high`, escalating to `blocker` when a tool can trigger unbounded production
mutation, external calls, crawling, deployment, or data export.

**Rule.** Tools that call external systems, perform fan-out, crawl URLs, export data,
deploy, enqueue work, or run expensive computation must have bounded inputs, timeouts,
concurrency controls, output limits, and cancellation/retry policy.

**Why.** Stateless requests can still be expensive. A single prompt-driven tool call should
not become unbounded infrastructure or data access.

**Evidence.**

- Source/config: timeouts, max result counts, concurrency limiter, queue/workflow boundary,
  URL allowlists, output truncation.
- CI/artifacts: tests for limits, timeout behavior, cancellation, and over-limit errors.
- Runtime/deploy: operational limit runbook and alert thresholds.
- Exception: `acceptedException` must name the tool, risk, owner, controls, evidence,
  expiry/review date, and approval trail.

**vcqa.** Flag tools that accept arbitrary URLs, SQL, shell commands, IDs arrays, or export
requests without caps, allowlists, timeout, or fan-out tests.

**References.**

- Cloudflare Workers documentation:
  <https://developers.cloudflare.com/workers/>
- OWASP Server Side Request Forgery Prevention Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html>
