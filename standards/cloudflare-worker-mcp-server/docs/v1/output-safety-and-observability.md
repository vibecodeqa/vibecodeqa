# Output Safety And Observability

## R-OUT-1 - Tool output is untrusted data

**Rule.** Tool output, fetched web content, repository text, issue comments, documents,
and upstream API responses must be treated as untrusted data and must not be interpreted
as instructions to call more tools or bypass policy.

**Why.** MCP servers move untrusted content into model context. Prompt injection can cause
unauthorized access, data disclosure, and tool misuse when content is treated as authority.

**vcqa.** Inspect tools that return external/user-controlled content for boundary labels,
structured fields, allowlisted follow-up actions, and tests or review notes covering
prompt-injection content.

**References.**

- https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- https://owasp.org/www-project-top-10-for-large-language-model-applications/
- https://modelcontextprotocol.io/specification/2025-11-25/server/tools

## R-OUT-2 - Tool results exclude credentials and hidden policy

**Rule.** Tool results must not include credentials, bearer tokens, OAuth refresh tokens,
secret names, internal policy text, or hidden system/developer instructions.

**Why.** Tool results are often forwarded into a client transcript and may be visible to
the user, model, logs, or another tool call.

**vcqa.** Scan tool result construction for tokens, `Authorization` headers, secret-like
fields, raw environment values, and internal prompts or policy strings.

**References.**

- https://developers.cloudflare.com/agents/model-context-protocol/guides/build-codemode-mcp-server/
- https://developers.cloudflare.com/agents/model-context-protocol/guides/build-codemode-openapi-mcp-server/
- https://owasp.org/www-project-top-10-for-large-language-model-applications/

## R-OUT-3 - Large outputs are bounded before model context

**Rule.** Tools that can return large result sets must paginate, summarize, filter, or
cap output before returning to the MCP client.

**Why.** Truncation after tool execution does not reduce upstream work, cost, leakage, or
prompt-injection surface. Bounded outputs also make subsequent model decisions more
reliable.

**vcqa.** Inspect tool schemas and handlers for `limit`, `cursor`, `fields`, filters,
response caps, and tests for large result sets; flag unbounded list/search/read-all tools.

**References.**

- https://developers.cloudflare.com/agents/model-context-protocol/guides/build-codemode-mcp-server/
- https://developers.cloudflare.com/agents/model-context-protocol/guides/build-codemode-openapi-mcp-server/
- https://owasp.org/www-project-top-10-for-large-language-model-applications/

## R-OBS-1 - Requests carry correlation across tool execution

**Rule.** Each MCP request or tool invocation should carry a correlation ID through Worker
logs, upstream calls, Durable Object calls, audit events, and error responses.

**Why.** Remote MCP failures cross multiple boundaries: client, Worker, OAuth, storage,
Durable Objects, and upstream APIs. Correlation is required to debug without exposing raw
payloads.

**vcqa.** Inspect request middleware, tool contexts, audit writes, upstream `fetch`
headers, and log statements for a stable invocation/request ID.

**References.**

- https://developers.cloudflare.com/workers/observability/
- https://developers.cloudflare.com/workers/observability/traces/
- https://developers.cloudflare.com/workers/observability/logs/workers-logs/

## R-OBS-2 - Auth, validation, and mutation failures are observable

**Rule.** Authorization denials, validation failures, upstream failures, and mutation
outcomes should be counted or logged with safe metadata.

**Why.** MCP operators need to distinguish bad clients, bad prompts, provider outages,
schema drift, and actual tool bugs.

**vcqa.** Check for structured logs, Workers Logs, Tail Workers, Analytics Engine, metrics,
or traces around auth failures, validation errors, tool failures, and mutation outcomes.

**References.**

- https://developers.cloudflare.com/workers/observability/
- https://developers.cloudflare.com/workers/observability/logs/tail-workers/
- https://developers.cloudflare.com/workers/observability/metrics-and-analytics/

## R-OBS-3 - Public errors do not become prompts

**Rule.** Error content returned to clients must be short, structured, and free of
instructions, raw stack traces, SQL text, internal URLs, or provider payloads.

**Why.** Error text can enter the model context just like successful tool output. Verbose
errors can leak internals or steer later tool calls.

**vcqa.** Inspect catch blocks, MCP error returns, `Response.json` error bodies, and
Durable Object exception boundaries for safe public messages and server-side detail
capture.

**References.**

- https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- https://developers.cloudflare.com/durable-objects/best-practices/error-handling/
- https://owasp.org/www-project-top-10-for-large-language-model-applications/

